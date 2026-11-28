import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    Activity, AlertTriangle, ArrowDownToLine, ArrowLeft, ArrowRight,
    Bell, Check, CheckCircle2, ChevronRight, CircleHelp, Clock3,
    Download, Gauge, MapPin, Plus, RefreshCw,
    ShieldCheck, Users, Wifi,
} from "lucide-react";
import {
    Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend,
    Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import PageHeader from "../../../shared/components/PageHeader/PageHeader";
import Button from "../../../shared/components/Button/Button";
import DataTable, { type DataTableColumn } from "../../../shared/components/DataTable/DataTable";
import StatusBadge from "../../../shared/components/StatusBadge/StatusBadge";
import Pagination from "../../../shared/components/Pagination/Pagination";
import EmptyState from "../../../shared/components/EmptyState/EmptyState";
import SearchFilter from "../../../shared/components/Search&Filter/Search&filter";
import Modal from "../../../shared/components/Modal/Modal";
import FormField from "../../../shared/components/FormField/FormField";
import ToastNotifications, { type ToastNotificationData } from "../../../shared/components/ToastNotifications/ToastNotifications";
import { ChartCard } from "../../../shared/components/ChartCard/ChartCard";
import {
    hourlyDemand, initialZoneAlerts, initialZoneMeters, initialZoneUsers,
    monthlyConsumption, zoneName,
} from "../data/zoneAdminData";
import type { ZoneAlert, ZoneAlertStatus, ZoneMeter, ZoneUser, ZoneUserStatus } from "../types/zoneAdmin";
import "./ZoneAdmin.css";

const PAGE_SIZE = 8;

function downloadCsv(filename: string, headers: string[], rows: Array<Array<string | number>>) {
    const escape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
    const contents = [headers, ...rows].map((row) => row.map(escape).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([contents], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
}

function readMeters(): ZoneMeter[] {
    try {
        const saved = window.localStorage.getItem("mdms-zone-meters");
        return saved ? [...(JSON.parse(saved) as ZoneMeter[]), ...initialZoneMeters] : initialZoneMeters;
    } catch {
        return initialZoneMeters;
    }
}

function useZoneToasts() {
    const [toasts, setToasts] = useState<ToastNotificationData[]>([]);
    const dismiss = (id: string) => setToasts((current) => current.filter((toast) => toast.id !== id));
    const notify = (message: string, type: ToastNotificationData["type"] = "success") => {
        const id = `${Date.now()}-${Math.random()}`;
        setToasts((current) => [...current, { id, message, type }]);
    };
    const container = <ToastNotifications notifications={toasts} onDismiss={dismiss} />;
    return { notify, container };
}

function ZoneShell({ children, className = "" }: { children: ReactNode; className?: string }) {
    return <div className={`zone-page ${className}`.trim()}>{children}</div>;
}

function Metric({ label, value, icon, tone = "blue", footnote }: { label: string; value: ReactNode; icon: ReactNode; tone?: string; footnote?: string }) {
    return (
        <div className="za-metric">
            <div className={`za-metric__icon za-metric__icon--${tone}`}>{icon}</div>
            <div className="za-metric__body"><span>{label}</span><strong>{value}</strong>{footnote && <small>{footnote}</small>}</div>
        </div>
    );
}

function Panel({ title, subtitle, action, children, className = "" }: { title: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string }) {
    return <section className={`za-panel ${className}`.trim()}><header className="za-panel__header"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>{action}</header>{children}</section>;
}

function formatNumber(value: number) {
    return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 }).format(value);
}

export function ZoneDashboard() {
    const openAlerts = initialZoneAlerts.filter((alert) => alert.status === "Open").length;
    const statusData = [
        { name: "Active", value: 2703, color: "#20a878" },
        { name: "Offline", value: 98, color: "#f59e0b" },
        { name: "Maintenance", value: 45, color: "#8b9ab0" },
    ];
    return (
        <ZoneShell>
            <PageHeader title="Zone dashboard" description={`${zoneName} · Live operations overview`} actions={<Button variant="outline" size="sm" onClick={() => window.print()}><Download size={16} /> Export overview</Button>} />
            <div className="za-metrics">
                <Metric label="Total meters" value="2,846" icon={<Gauge size={20} />} footnote="Across 12 service areas" />
                <Metric label="Online right now" value="95%" icon={<Wifi size={20} />} tone="green" footnote="2,703 meters reporting" />
                <Metric label="Registered consumers" value="2,412" icon={<Users size={20} />} tone="violet" footnote="+3.8% this quarter" />
                <Metric label="Open alerts" value={openAlerts} icon={<Bell size={20} />} tone="amber" footnote="2 require attention" />
            </div>
            <div className="za-dashboard-grid">
                <ChartCard title="Zone energy consumption" subtitle="Monthly usage compared with previous month (MWh)" height={300}>
                    <ResponsiveContainer width="100%" height="100%"><AreaChart data={monthlyConsumption} margin={{ top: 8, right: 10, left: -16, bottom: 0 }}>
                        <defs><linearGradient id="zaUsage" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2878d0" stopOpacity={0.24} /><stop offset="95%" stopColor="#2878d0" stopOpacity={0.01} /></linearGradient></defs>
                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} /><Tooltip /><Legend />
                        <Area type="monotone" dataKey="usage" name="This year" stroke="#2878d0" strokeWidth={2.5} fill="url(#zaUsage)" />
                        <Area type="monotone" dataKey="previous" name="Previous year" stroke="#a7b4c5" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
                    </AreaChart></ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Meter connectivity" subtitle="Current fleet status" height={300}>
                    <div className="za-donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusData} dataKey="value" nameKey="name" innerRadius={68} outerRadius={98} paddingAngle={3} stroke="none">{statusData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="za-donut-center"><strong>2,846</strong><span>Total meters</span></div></div>
                    <div className="za-legend">{statusData.map((item) => <span key={item.name}><i style={{ background: item.color }} />{item.name}<strong>{item.name === "Active" ? "2,703" : item.name === "Offline" ? "98" : "45"}</strong></span>)}</div>
                </ChartCard>
            </div>
            <div className="za-dashboard-grid za-dashboard-grid--bottom">
                <Panel title="Needs attention" subtitle="Alerts and equipment requiring follow-up" action={<Link className="za-text-link" to="/zone/alerts">View all <ChevronRight size={15} /></Link>}>
                    <div className="za-compact-list">{initialZoneAlerts.filter((alert) => alert.status !== "Resolved").slice(0, 4).map((alert) => <Link className="za-alert-row" to="/zone/alerts" key={alert.id}><span className={`za-alert-row__icon za-alert-row__icon--${alert.severity.toLowerCase()}`}><AlertTriangle size={17} /></span><span className="za-alert-row__content"><strong>{alert.title}</strong><small>{alert.meterNumber} · {alert.location}</small></span><StatusBadge status={alert.severity} /><span className="za-alert-row__time">{alert.createdAt}</span></Link>)}</div>
                </Panel>
                <Panel title="Meter sync status" subtitle="Recent fleet communication" action={<Link className="za-text-link" to="/zone/meters">Meter inventory <ChevronRight size={15} /></Link>}>
                    <div className="za-sync-summary"><span className="za-sync-summary__icon"><RefreshCw size={19} /></span><div><strong>2,703 meters synced</strong><small>Last fleet sync completed today at 10:45 AM</small></div><StatusBadge status="Healthy" variant="success" /></div>
                    <div className="za-progress"><span style={{ width: "95%" }} /></div><div className="za-sync-foot"><span>95% reporting within 15 minutes</span><span>143 need review</span></div>
                    <div className="za-coverage-note"><MapPin size={15} /> Highest coverage: Kadri Hills · 99.2% online</div>
                </Panel>
            </div>
        </ZoneShell>
    );
}

function MeterForm({ onSubmit, onCancel }: { onSubmit: (meter: ZoneMeter) => void; onCancel: () => void }) {
    const [meterNumber, setMeterNumber] = useState("");
    const [customer, setCustomer] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [meterType, setMeterType] = useState<ZoneMeter["meterType"]>("Smart meter");
    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit({ id: meterNumber.toLowerCase(), meterNumber, customer, email, address, meterType, status: "Active", lastReading: 0, lastSync: "Not synced yet", monthlyUsage: 0, installedOn: new Date().toISOString().slice(0, 10) });
    };
    return <form className="za-form" onSubmit={submit}>
        <FormField label="Meter number" name="meter-number" value={meterNumber} onChange={setMeterNumber} placeholder="e.g. MNG-20430" required />
        <FormField label="Customer name" name="meter-customer" value={customer} onChange={setCustomer} placeholder="Full name" required />
        <FormField label="Customer email" name="meter-email" type="email" value={email} onChange={setEmail} placeholder="name@example.com" required />
        <FormField label="Service address" name="meter-address" value={address} onChange={setAddress} placeholder="Street, area, city" required />
        <label className="za-field"><span>Meter type</span><select value={meterType} onChange={(event) => setMeterType(event.target.value as ZoneMeter["meterType"])}><option>Smart meter</option><option>Prepaid meter</option></select></label>
        <div className="za-form__actions"><Button variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit"><Plus size={16} /> Add meter</Button></div>
    </form>;
}

export function ZoneMeters() {
    const navigate = useNavigate();
    const [meters, setMeters] = useState(readMeters);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [meterType, setMeterType] = useState("");
    const [page, setPage] = useState(1);
    const [adding, setAdding] = useState(false);
    const { notify, container } = useZoneToasts();
    const filtered = useMemo(() => meters.filter((meter) => {
        const term = search.trim().toLowerCase();
        return (!term || [meter.meterNumber, meter.customer, meter.email, meter.address].some((value) => value.toLowerCase().includes(term))) && (!status || meter.status === status) && (!meterType || meter.meterType === meterType);
    }), [meters, search, status, meterType]);
    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const columns: DataTableColumn<ZoneMeter>[] = [
        { key: "meterNumber", header: "Meter", accessor: "meterNumber", sortable: true, render: (meter) => <span className="za-primary-cell"><strong>{meter.meterNumber}</strong><small>{meter.meterType}</small></span> },
        { key: "customer", header: "Customer", accessor: "customer", sortable: true, render: (meter) => <span className="za-primary-cell"><strong>{meter.customer}</strong><small>{meter.email}</small></span> },
        { key: "address", header: "Service address", accessor: "address" },
        { key: "lastReading", header: "Last reading", accessor: "lastReading", sortable: true, render: (meter) => `${formatNumber(meter.lastReading)} kWh` },
        { key: "lastSync", header: "Last sync", accessor: "lastSync" },
        { key: "status", header: "Status", render: (meter) => <StatusBadge status={meter.status} variant={meter.status === "Active" ? "success" : meter.status === "Offline" ? "warning" : "neutral"} /> },
        { key: "action", header: "", align: "right", render: (meter) => <button className="za-icon-button" type="button" aria-label={`Open ${meter.meterNumber}`} onClick={(event) => { event.stopPropagation(); navigate(`/zone/meters/${meter.id}`); }}><ArrowRight size={17} /></button> },
    ];
    return <ZoneShell>
        {container}
        <PageHeader title="Meter management" description={`${zoneName} · Review connectivity, readings, and customer assignments`} actions={<><Button variant="outline" onClick={() => { downloadCsv("zone-meter-inventory.csv", ["Meter number", "Customer", "Email", "Address", "Type", "Status", "Last reading (kWh)", "Last sync"], filtered.map((meter) => [meter.meterNumber, meter.customer, meter.email, meter.address, meter.meterType, meter.status, meter.lastReading, meter.lastSync])); notify("Meter inventory exported as CSV.", "info"); }}><ArrowDownToLine size={16} /> Export</Button><Button onClick={() => setAdding(true)}><Plus size={17} /> Add meter</Button></>} />
        <div className="za-summary-strip"><span><strong>{meters.length.toLocaleString("en-IN")}</strong> meters shown</span><span><i className="za-dot za-dot--green" />{meters.filter((meter) => meter.status === "Active").length} active</span><span><i className="za-dot za-dot--amber" />{meters.filter((meter) => meter.status === "Offline").length} offline</span><span><i className="za-dot za-dot--slate" />{meters.filter((meter) => meter.status === "Maintenance").length} in maintenance</span></div>
        <Panel title="Meter inventory" subtitle="Search and filter meters assigned to your zone">
            <SearchFilter searchValue={search} onSearchChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search meter, customer, or address" filters={[
                { name: "meter-status", label: "Status", value: status, onChange: (value) => { setStatus(value); setPage(1); }, options: [{ value: "Active", label: "Active" }, { value: "Offline", label: "Offline" }, { value: "Maintenance", label: "Maintenance" }] },
                { name: "meter-type", label: "Type", value: meterType, onChange: (value) => { setMeterType(value); setPage(1); }, options: [{ value: "Smart meter", label: "Smart meter" }, { value: "Prepaid meter", label: "Prepaid meter" }] },
            ]} />
            {filtered.length ? <><DataTable columns={columns} data={rows} rowKey="id" onRowClick={(meter) => navigate(`/zone/meters/${meter.id}`)} /><div className="za-table-footer"><span>Showing {filtered.length ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} meters</span><Pagination currentPage={page} totalPages={pageCount} onPageChange={setPage} /></div></> : <EmptyState title="No meters match these filters" description="Try a different search or clear one of the filters." action={<Button variant="outline" onClick={() => { setSearch(""); setStatus(""); setMeterType(""); }}>Clear filters</Button>} />}
        </Panel>
        <Modal isOpen={adding} onClose={() => setAdding(false)} title="Add meter"><MeterForm onCancel={() => setAdding(false)} onSubmit={(meter) => { const saved = [...readMeters().filter((item) => !initialZoneMeters.some((seed) => seed.id === item.id)), meter]; window.localStorage.setItem("mdms-zone-meters", JSON.stringify(saved)); setMeters([meter, ...meters]); setAdding(false); setPage(1); notify(`${meter.meterNumber} was added to ${zoneName}.`); }} /></Modal>
    </ZoneShell>;
}

export function ZoneMeterDetails() {
    const { meterId = "" } = useParams();
    const meter = readMeters().find((item) => item.id === meterId || item.meterNumber === meterId);
    const { notify, container } = useZoneToasts();
    if (!meter) return <ZoneShell>{container}<PageHeader title="Meter details" /><EmptyState title="Meter not found" description="This meter may have been removed or assigned to another zone." action={<Link className="za-back-link" to="/zone/meters"><ArrowLeft size={16} /> Back to meter management</Link>} /></ZoneShell>;
    const readings = [
        { day: "Nov 28", reading: meter.lastReading, consumption: 15.0, signal: "Good" },
        { day: "Nov 27", reading: meter.lastReading - 15.0, consumption: 14.3, signal: "Good" },
        { day: "Nov 26", reading: meter.lastReading - 29.3, consumption: 13.8, signal: "Good" },
        { day: "Nov 25", reading: meter.lastReading - 43.1, consumption: 16.2, signal: "Fair" },
        { day: "Nov 24", reading: meter.lastReading - 59.3, consumption: 12.7, signal: "Good" },
    ];
    const columns: DataTableColumn<(typeof readings)[number]>[] = [
        { key: "day", header: "Date", accessor: "day", sortable: true },
        { key: "reading", header: "Cumulative reading", render: (row) => `${formatNumber(row.reading)} kWh` },
        { key: "consumption", header: "Daily consumption", render: (row) => `${formatNumber(row.consumption)} kWh` },
        { key: "signal", header: "Signal", render: (row) => <StatusBadge status={row.signal} variant={row.signal === "Good" ? "success" : "warning"} /> },
    ];
    return <ZoneShell>
        {container}
        <Link className="za-back-link" to="/zone/meters"><ArrowLeft size={16} /> Meter management</Link>
        <PageHeader title={meter.meterNumber} description={`${meter.customer} · ${meter.address}`} actions={<><Button variant="outline" onClick={() => notify("A fresh reading sync has been requested.", "info")}><RefreshCw size={16} /> Sync meter</Button><Button onClick={() => notify(`Service request created for ${meter.meterNumber}.`, "success")}>Create service request</Button></>} />
        <div className="za-detail-status"><span><StatusBadge status={meter.status} variant={meter.status === "Active" ? "success" : meter.status === "Offline" ? "warning" : "neutral"} /></span><span><Clock3 size={15} /> Last sync {meter.lastSync}</span><span><Gauge size={15} /> {meter.meterType}</span><span><MapPin size={15} /> {zoneName}</span></div>
        <div className="za-detail-metrics"><Metric label="Current reading" value={`${formatNumber(meter.lastReading)} kWh`} icon={<Gauge size={20} />} /><Metric label="This month" value={`${formatNumber(meter.monthlyUsage)} kWh`} icon={<Activity size={20} />} tone="green" /><Metric label="Customer" value={meter.customer} icon={<Users size={20} />} tone="violet" /><Metric label="Installed" value={new Date(`${meter.installedOn}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} icon={<CheckCircle2 size={20} />} tone="amber" /></div>
        <div className="za-dashboard-grid"><ChartCard title="Consumption trend" subtitle="Daily energy use over the last 30 days" height={280}><ResponsiveContainer width="100%" height="100%"><AreaChart data={hourlyDemand} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}><CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} /><Tooltip /><Area type="monotone" dataKey="usage" name="kWh" stroke="#2878d0" fill="#2878d022" strokeWidth={2} /></AreaChart></ResponsiveContainer></ChartCard>
            <Panel title="Customer and service" subtitle="Meter assignment details"><dl className="za-detail-list"><div><dt>Customer</dt><dd>{meter.customer}</dd></div><div><dt>Email</dt><dd>{meter.email}</dd></div><div><dt>Service address</dt><dd>{meter.address}</dd></div><div><dt>Tariff plan</dt><dd>Residential · Standard</dd></div><div><dt>Meter serial</dt><dd>{meter.meterNumber}</dd></div></dl><Button variant="outline" onClick={() => notify(`Customer record for ${meter.customer} opened.`, "info")}>View customer record <ArrowRight size={15} /></Button></Panel>
        </div>
        <Panel title="Recent readings" subtitle="Latest meter telemetry received by the zone">
            <DataTable columns={columns} data={readings} rowKey="day" />
        </Panel>
    </ZoneShell>;
}

function UserForm({ onSubmit, onCancel }: { onSubmit: (user: ZoneUser) => void; onCancel: () => void }) {
    const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [phone, setPhone] = useState(""); const [role, setRole] = useState<ZoneUser["role"]>("Field Operator");
    const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); onSubmit({ id: `zu-${Date.now()}`, name, email, phone, role, status: "Invited", lastActive: "Invite pending", joinedOn: new Date().toISOString().slice(0, 10) }); };
    return <form className="za-form" onSubmit={submit}><FormField label="Full name" name="zone-user-name" value={name} onChange={setName} required /><FormField label="Work email" name="zone-user-email" type="email" value={email} onChange={setEmail} required /><FormField label="Phone" name="zone-user-phone" type="tel" value={phone} onChange={setPhone} required /><label className="za-field"><span>Role</span><select value={role} onChange={(event) => setRole(event.target.value as ZoneUser["role"])}><option>Field Operator</option><option>Customer Support</option><option>Zone Admin</option></select></label><p className="za-form-note"><ShieldCheck size={16} /> The invitation includes the permissions attached to this role.</p><div className="za-form__actions"><Button variant="secondary" onClick={onCancel}>Cancel</Button><Button type="submit">Send invitation</Button></div></form>;
}

export function ZoneUsers() {
    const [users, setUsers] = useState(initialZoneUsers);
    const [search, setSearch] = useState(""); const [role, setRole] = useState(""); const [status, setStatus] = useState(""); const [page, setPage] = useState(1); const [inviting, setInviting] = useState(false);
    const { notify, container } = useZoneToasts();
    const filtered = useMemo(() => users.filter((user) => { const term = search.trim().toLowerCase(); return (!term || [user.name, user.email, user.phone].some((value) => value.toLowerCase().includes(term))) && (!role || user.role === role) && (!status || user.status === status); }), [users, search, role, status]);
    const columns: DataTableColumn<ZoneUser>[] = [
        { key: "name", header: "Team member", accessor: "name", sortable: true, render: (user) => <span className="za-primary-cell"><strong>{user.name}</strong><small>{user.email}</small></span> },
        { key: "phone", header: "Phone", accessor: "phone" },
        { key: "role", header: "Role", accessor: "role", sortable: true },
        { key: "lastActive", header: "Last active", accessor: "lastActive" },
        { key: "status", header: "Status", render: (user) => <StatusBadge status={user.status} variant={user.status === "Active" ? "success" : user.status === "Invited" ? "info" : "danger"} /> },
        { key: "actions", header: "Access", align: "right", render: (user) => <Button size="sm" variant="outline" onClick={() => { const next: ZoneUserStatus = user.status === "Suspended" ? "Active" : "Suspended"; setUsers((current) => current.map((entry) => entry.id === user.id ? { ...entry, status: next } : entry)); notify(`${user.name}'s access is now ${next.toLowerCase()}.`, next === "Active" ? "success" : "warning"); }}>{user.status === "Suspended" ? "Restore" : "Suspend"}</Button> },
    ];
    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    return <ZoneShell>{container}<PageHeader title="User management" description="Manage team access and responsibilities in your zone" actions={<Button onClick={() => setInviting(true)}><Plus size={17} /> Invite team member</Button>} />
        <div className="za-metrics za-metrics--compact"><Metric label="Team members" value={users.length} icon={<Users size={20} />} /><Metric label="Active accounts" value={users.filter((user) => user.status === "Active").length} icon={<CheckCircle2 size={20} />} tone="green" /><Metric label="Invitations pending" value={users.filter((user) => user.status === "Invited").length} icon={<Clock3 size={20} />} tone="amber" /></div>
        <Panel title="Zone team" subtitle="Control access for staff assigned to this zone"><SearchFilter searchValue={search} onSearchChange={(value) => { setSearch(value); setPage(1); }} placeholder="Search name, email, or phone" filters={[{ name: "role", label: "Role", value: role, onChange: (value) => { setRole(value); setPage(1); }, options: [{ value: "Zone Admin", label: "Zone Admin" }, { value: "Field Operator", label: "Field Operator" }, { value: "Customer Support", label: "Customer Support" }] }, { name: "user-status", label: "Status", value: status, onChange: (value) => { setStatus(value); setPage(1); }, options: [{ value: "Active", label: "Active" }, { value: "Invited", label: "Invited" }, { value: "Suspended", label: "Suspended" }] }]} />
            {filtered.length ? <><DataTable columns={columns} data={rows} rowKey="id" /><div className="za-table-footer"><span>{filtered.length} team members</span><Pagination currentPage={page} totalPages={pageCount} onPageChange={setPage} /></div></> : <EmptyState title="No team members found" description="Adjust the search or filters to see more people." />}
        </Panel>
        <Panel title="Role permissions" subtitle="Default access granted to each role"><div className="za-permission-grid"><div><ShieldCheck size={19} /><strong>Zone Admin</strong><p>Manage meters, users, reports, alerts, and zone settings.</p></div><div><Gauge size={19} /><strong>Field Operator</strong><p>View meter details, perform syncs, and update service visits.</p></div><div><CircleHelp size={19} /><strong>Customer Support</strong><p>View customer and meter information and respond to alerts.</p></div></div></Panel>
        <Modal isOpen={inviting} onClose={() => setInviting(false)} title="Invite team member"><UserForm onCancel={() => setInviting(false)} onSubmit={(user) => { setUsers((current) => [user, ...current]); setInviting(false); setPage(1); notify(`Invitation sent to ${user.email}.`); }} /></Modal>
    </ZoneShell>;
}

export function ZoneReports() {
    const [period, setPeriod] = useState<"Week" | "Month" | "Year">("Month");
    const [area, setArea] = useState("All service areas");
    const { notify, container } = useZoneToasts();
    const data = period === "Week" ? hourlyDemand.map((item) => ({ label: `${item.label}:00`, usage: item.usage * 0.2, previous: item.usage * 0.18 })) : period === "Year" ? [...monthlyConsumption, { label: "Dec", usage: 20.7, previous: 19.8 }] : monthlyConsumption;
    const title = period === "Week" ? "This week" : period === "Year" ? "This year" : "This month";
    const areaUsage = [{ area: "Kadri", usage: 5.2 }, { area: "Bejai", usage: 4.7 }, { area: "Urwa", usage: 3.8 }, { area: "Kottara", usage: 3.4 }, { area: "Derebail", usage: 2.9 }, { area: "Other", usage: 4.3 }];
    const visibleAreaUsage = area === "All service areas" ? areaUsage : areaUsage.filter((item) => item.area.toLowerCase().startsWith(area.split(" ")[0].toLowerCase()));
    return <ZoneShell>{container}<PageHeader title="Reports & analytics" description={`${zoneName} · Energy usage, meter health, and service performance`} actions={<Button onClick={() => { downloadCsv(`zone-${period.toLowerCase()}-report.csv`, ["Period", "Service area", "Energy usage (MWh)", "Previous period (MWh)"], data.map((item) => [item.label, area, item.usage, item.previous])); notify(`${period} zone report downloaded.`, "success"); }}><Download size={16} /> Download report</Button>} />
        <div className="za-report-controls"><span className="za-period-label">Reporting period</span><div className="za-segmented">{(["Week", "Month", "Year"] as const).map((item) => <button key={item} type="button" aria-pressed={period === item} className={period === item ? "is-active" : ""} onClick={() => setPeriod(item)}>{item}</button>)}</div><label className="za-field za-field--inline"><span>Service area</span><select value={area} onChange={(event) => setArea(event.target.value)}><option>All service areas</option><option>Kadri Hills</option><option>Bejai</option><option>Urwa</option><option>Kottara</option></select></label></div>
        <div className="za-metrics"><Metric label="Energy delivered" value={period === "Week" ? "4,218 MWh" : period === "Year" ? "241,902 MWh" : "24,320 MWh"} icon={<Activity size={20} />} footnote="+7.1% vs previous period" /><Metric label="Average daily usage" value="786 kWh" icon={<Gauge size={20} />} tone="green" footnote="Across active meters" /><Metric label="Peak demand" value="1,842 kW" icon={<ZapIcon />} tone="amber" footnote="Yesterday at 8:15 PM" /><Metric label="Collection rate" value="96.4%" icon={<CheckCircle2 size={20} />} tone="violet" footnote="+1.2% this month" /></div>
        <div className="za-dashboard-grid"><ChartCard title={`${title} energy usage`} subtitle={`${area} · Current period vs previous period (MWh)`} height={310}><ResponsiveContainer width="100%" height="100%"><AreaChart data={data} margin={{ top: 8, right: 10, left: -16, bottom: 0 }}><defs><linearGradient id="zaReportUsage" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2878d0" stopOpacity={0.2} /><stop offset="95%" stopColor="#2878d0" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} /><Tooltip /><Legend /><Area type="monotone" dataKey="usage" name="Current period" stroke="#2878d0" fill="url(#zaReportUsage)" strokeWidth={2.5} /><Area type="monotone" dataKey="previous" name="Previous period" stroke="#8ea0b5" fill="transparent" strokeDasharray="5 5" strokeWidth={2} /></AreaChart></ResponsiveContainer></ChartCard>
            <ChartCard title="Usage by service area" subtitle="Energy delivered this month (MWh)" height={310}><ResponsiveContainer width="100%" height="100%"><BarChart data={visibleAreaUsage} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}><CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--border)" /><XAxis dataKey="area" axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 11 }} /><YAxis axisLine={false} tickLine={false} tick={{ fill: "var(--text-muted)", fontSize: 12 }} /><Tooltip /><Bar dataKey="usage" name="MWh" fill="#2878d0" radius={[5, 5, 0, 0]} /></BarChart></ResponsiveContainer></ChartCard>
        </div>
        <Panel title="Report library" subtitle="Ready-to-export summaries for this zone"><div className="za-report-list">{[{ title: "Monthly energy and billing summary", detail: "Usage, billing, and collection performance", date: "Updated today" }, { title: "Meter health and connectivity", detail: "Offline devices, signal health, and sync history", date: "Updated today" }, { title: "Consumer enrollment", detail: "New registrations and account status", date: "Updated yesterday" }].map((report, index) => <div className="za-report-item" key={report.title}><span className="za-report-item__icon"><Download size={17} /></span><span><strong>{report.title}</strong><small>{report.detail} · {report.date}</small></span><Button size="sm" variant="outline" onClick={() => { const rows = index === 1 ? initialZoneMeters.map((meter) => [meter.meterNumber, meter.status, meter.lastSync, meter.monthlyUsage]) : index === 2 ? initialZoneUsers.map((user) => [user.name, user.email, user.role, user.status]) : monthlyConsumption.map((item) => [item.label, item.usage, item.previous]); const headers = index === 1 ? ["Meter", "Status", "Last sync", "Monthly usage (kWh)"] : index === 2 ? ["Name", "Email", "Role", "Status"] : ["Month", "Usage (MWh)", "Previous year (MWh)"]; downloadCsv(`zone-report-${index + 1}.csv`, headers, rows); notify(`${report.title} downloaded.`, "success"); }}>Export</Button></div>)}</div></Panel>
    </ZoneShell>;
}

function ZapIcon() { return <Activity size={20} />; }

export function ZoneAlerts() {
    const [alerts, setAlerts] = useState(initialZoneAlerts);
    const [search, setSearch] = useState(""); const [severity, setSeverity] = useState(""); const [status, setStatus] = useState(""); const [selected, setSelected] = useState<ZoneAlert | null>(null);
    const { notify, container } = useZoneToasts();
    const filtered = useMemo(() => alerts.filter((alert) => { const term = search.trim().toLowerCase(); return (!term || [alert.title, alert.detail, alert.meterNumber, alert.location].some((value) => value.toLowerCase().includes(term))) && (!severity || alert.severity === severity) && (!status || alert.status === status); }), [alerts, search, severity, status]);
    const updateStatus = (alert: ZoneAlert, next: ZoneAlertStatus) => { setAlerts((current) => current.map((item) => item.id === alert.id ? { ...item, status: next } : item)); notify(`Alert ${alert.id} marked ${next.toLowerCase()}.`, next === "Resolved" ? "success" : "info"); };
    const columns: DataTableColumn<ZoneAlert>[] = [
        { key: "title", header: "Alert", accessor: "title", sortable: true, render: (alert) => <button className="za-alert-link" type="button" onClick={() => setSelected(alert)}><strong>{alert.title}</strong><small>{alert.detail}</small></button> },
        { key: "meterNumber", header: "Meter / location", render: (alert) => <span className="za-primary-cell"><strong>{alert.meterNumber}</strong><small>{alert.location}</small></span> },
        { key: "severity", header: "Severity", render: (alert) => <StatusBadge status={alert.severity} variant={alert.severity === "Critical" ? "danger" : alert.severity === "Warning" ? "warning" : "info"} /> },
        { key: "createdAt", header: "Received", accessor: "createdAt", sortable: true },
        { key: "status", header: "Status", render: (alert) => <StatusBadge status={alert.status} variant={alert.status === "Open" ? "danger" : alert.status === "Acknowledged" ? "warning" : "success"} /> },
        { key: "actions", header: "", align: "right", render: (alert) => alert.status === "Open" ? <Button size="sm" variant="outline" onClick={() => updateStatus(alert, "Acknowledged")}>Acknowledge</Button> : alert.status === "Acknowledged" ? <Button size="sm" variant="outline" onClick={() => updateStatus(alert, "Resolved")}>Resolve</Button> : <span className="za-resolved-mark"><Check size={15} /> Done</span> },
    ];
    const openCount = alerts.filter((alert) => alert.status === "Open").length;
    return <ZoneShell>{container}<PageHeader title="Alerts" description="Monitor incidents and coordinate follow-up across your zone" actions={<Button variant="outline" onClick={() => notify("Alerts are up to date.", "info")}><RefreshCw size={16} /> Refresh alerts</Button>} />
        <div className="za-alert-summary"><div><span className="za-alert-summary__icon za-alert-summary__icon--critical"><AlertTriangle size={20} /></span><span><strong>{openCount}</strong><small>Open alerts</small></span></div><div><span className="za-alert-summary__icon za-alert-summary__icon--warning"><Clock3 size={20} /></span><span><strong>{alerts.filter((alert) => alert.status === "Acknowledged").length}</strong><small>Acknowledged</small></span></div><div><span className="za-alert-summary__icon za-alert-summary__icon--success"><CheckCircle2 size={20} /></span><span><strong>{alerts.filter((alert) => alert.status === "Resolved").length}</strong><small>Resolved</small></span></div><div className="za-alert-summary__meta"><span>Auto-refresh enabled</span><small>Last checked just now</small></div></div>
        <Panel title="Zone alert center" subtitle="Review, acknowledge, and resolve operational events"><SearchFilter searchValue={search} onSearchChange={setSearch} placeholder="Search alert, meter, or location" filters={[{ name: "severity", label: "Severity", value: severity, onChange: setSeverity, options: [{ value: "Critical", label: "Critical" }, { value: "Warning", label: "Warning" }, { value: "Info", label: "Info" }] }, { name: "alert-status", label: "Status", value: status, onChange: setStatus, options: [{ value: "Open", label: "Open" }, { value: "Acknowledged", label: "Acknowledged" }, { value: "Resolved", label: "Resolved" }] }]} />
            {filtered.length ? <DataTable columns={columns} data={filtered} rowKey="id" /> : <EmptyState title="No alerts found" description="There are no alerts matching your search or filters." action={<Button variant="outline" onClick={() => { setSearch(""); setSeverity(""); setStatus(""); }}>Clear filters</Button>} />}
        </Panel>
        <Modal isOpen={selected !== null} onClose={() => setSelected(null)} title={selected?.title ?? "Alert details"}>{selected && <div className="za-alert-detail"><div className="za-alert-detail__badges"><StatusBadge status={selected.severity} variant={selected.severity === "Critical" ? "danger" : selected.severity === "Warning" ? "warning" : "info"} /><StatusBadge status={selected.status} /></div><p>{selected.detail}</p><dl className="za-detail-list"><div><dt>Meter</dt><dd>{selected.meterNumber}</dd></div><div><dt>Location</dt><dd>{selected.location}</dd></div><div><dt>Received</dt><dd>{selected.createdAt}</dd></div></dl><div className="za-form__actions"><Button variant="secondary" onClick={() => setSelected(null)}>Close</Button>{selected.status === "Open" && <Button onClick={() => { updateStatus(selected, "Acknowledged"); setSelected(null); }}>Acknowledge</Button>}{selected.status === "Acknowledged" && <Button onClick={() => { updateStatus(selected, "Resolved"); setSelected(null); }}>Mark resolved</Button>}</div></div>}</Modal>
    </ZoneShell>;
}

interface ZonePreferences { syncInterval: string; alertThreshold: string; emailAlerts: boolean; smsAlerts: boolean; weeklyReport: boolean; maintenanceWindow: string }
const defaultPreferences: ZonePreferences = { syncInterval: "15 minutes", alertThreshold: "20", emailAlerts: true, smsAlerts: false, weeklyReport: true, maintenanceWindow: "02:00–04:00" };

export function ZoneSettings() {
    const [preferences, setPreferences] = useState<ZonePreferences>(() => {
        try { const saved = window.localStorage.getItem("mdms-zone-preferences"); return saved ? { ...defaultPreferences, ...JSON.parse(saved) as Partial<ZonePreferences> } : defaultPreferences; }
        catch { return defaultPreferences; }
    });
    const [saving, setSaving] = useState(false);
    const { notify, container } = useZoneToasts();
    const update = <K extends keyof ZonePreferences>(key: K, value: ZonePreferences[K]) => setPreferences((current) => ({ ...current, [key]: value }));
    const save = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSaving(true); window.localStorage.setItem("mdms-zone-preferences", JSON.stringify(preferences)); window.setTimeout(() => { setSaving(false); notify("Zone settings have been saved."); }, 250); };
    const reset = () => { setPreferences(defaultPreferences); window.localStorage.removeItem("mdms-zone-preferences"); notify("Zone settings restored to defaults.", "info"); };
    return <ZoneShell>{container}<PageHeader title="Zone settings" description="Configure operational preferences for Mangalore North" actions={<Button variant="outline" onClick={reset}>Restore defaults</Button>} />
        <form className="za-settings" onSubmit={save}>
            <Panel title="Zone profile" subtitle="Details used across operations and reports"><div className="za-settings-grid"><div className="za-static-field"><span>Zone name</span><strong>{zoneName}</strong></div><div className="za-static-field"><span>Zone code</span><strong>KA-MNG-04</strong></div><div className="za-static-field"><span>Region</span><strong>Karnataka · Coastal</strong></div><div className="za-static-field"><span>Zone administrator</span><strong>Sowmya Kini</strong></div></div><div className="za-settings-hint"><MapPin size={16} /> Zone profile details are managed by the enterprise administrator.</div></Panel>
            <Panel title="Meter operations" subtitle="Set how often meters communicate and when maintenance is planned"><div className="za-settings-grid"><label className="za-field"><span>Meter sync interval</span><select value={preferences.syncInterval} onChange={(event) => update("syncInterval", event.target.value)}><option>5 minutes</option><option>15 minutes</option><option>30 minutes</option><option>1 hour</option></select><small>Applies to connected smart meters.</small></label><label className="za-field"><span>Maintenance window</span><select value={preferences.maintenanceWindow} onChange={(event) => update("maintenanceWindow", event.target.value)}><option>00:00–02:00</option><option>02:00–04:00</option><option>04:00–06:00</option><option>Custom schedule</option></select><small>Preferred period for planned service work.</small></label><label className="za-field"><span>Usage alert threshold</span><div className="za-input-suffix"><input type="number" min="5" max="100" value={preferences.alertThreshold} onChange={(event) => update("alertThreshold", event.target.value)} /><span>% above average</span></div><small>Notify the team when daily consumption exceeds its 30-day average.</small></label></div></Panel>
            <Panel title="Notifications" subtitle="Choose which operational updates your team receives"><div className="za-toggle-list"><label className="za-toggle-row"><span><strong>Email alerts</strong><small>Critical incidents, offline meters, and service updates.</small></span><input type="checkbox" checked={preferences.emailAlerts} onChange={(event) => update("emailAlerts", event.target.checked)} /></label><label className="za-toggle-row"><span><strong>SMS alerts</strong><small>Send critical alerts to on-call zone staff by text.</small></span><input type="checkbox" checked={preferences.smsAlerts} onChange={(event) => update("smsAlerts", event.target.checked)} /></label><label className="za-toggle-row"><span><strong>Weekly zone report</strong><small>Email a summary of energy usage and meter health every Monday.</small></span><input type="checkbox" checked={preferences.weeklyReport} onChange={(event) => update("weeklyReport", event.target.checked)} /></label></div></Panel>
            <Panel title="Data & privacy" subtitle="Operational data handling information"><div className="za-data-notice"><ShieldCheck size={20} /><div><strong>Zone scoped access</strong><p>Team members can access customer and meter records assigned to this zone. Enterprise-level retention and security policies are managed centrally.</p></div></div><div className="za-data-notice"><Clock3 size={20} /><div><strong>Reading retention</strong><p>Meter readings are retained according to the organization data policy. Contact your enterprise administrator for retention or export requests.</p></div></div></Panel>
            <div className="za-settings-actions"><span>Changes apply to this zone only.</span><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save settings"}</Button></div>
        </form>
    </ZoneShell>;
}
