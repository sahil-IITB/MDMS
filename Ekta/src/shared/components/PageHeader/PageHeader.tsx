import type { ReactNode } from "react";
import "./PageHeader.css";

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