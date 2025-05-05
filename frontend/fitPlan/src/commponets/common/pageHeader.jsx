function PageHeader({ titel, description }) {
    return <>
        <div className="row text-center mt-3">
            <div className="rol">
                <h2>{titel}</h2>
                {description ?? <p className="col">{description}</p>}

            </div>
        </div>
    </>
}

export default PageHeader;