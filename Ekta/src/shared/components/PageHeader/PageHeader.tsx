import type { ReactNode } from "react";
import "./PageHeader.css";

/**
 * PageHeader Component
 *
 * A reusable page header for displaying a page title, optional description,
 * and optional action elements such as buttons.
 *
 * Props:
 * - title: The main heading of the page (required).
 * - description: Supporting text displayed below the title (optional).
 * - actions: ReactNode containing buttons or other action elements (optional).
 *
 * Usage:
 *
 * <PageHeader
 *   title="Dashboard"
 *   description="Overview of your electricity consumption and account"
 *   actions={<button>Download Report</button>}
 * />
 *
 * This component is used to maintain a consistent header layout
 * across different pages of the application.
 */

interface PageHeaderProps{
    title : string;
    description? : string;
    actions? : ReactNode;
}

function PageHeader({title, description, actions}: PageHeaderProps){
    return (
        <div className="page-header">
            <div className="page-header__content">
                <h1 className="page-header__title">{title}</h1>

                {description && (
                    <p className="page-header__description">{description}</p>
                )}
            </div>

            {actions && (
                <div className="page-header__actions">
                    {actions}
                </div>
            )}
        </div>
    );
}

export default PageHeader;