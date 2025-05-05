
function Card({
    card: {
        name, description, category, difficulty, equipment, location
    },
}) {
    return (

        <div className="card" style={{ width: "14rem" }}>
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <h6>{description}</h6>
                <p className="card-text">{category}</p>

                <ul className="list-group list-group-flush">
                    <li className="list-group-item"><span><i className="bi bi-bar-chart-fill"></i></span> {difficulty}</li>
                    <li className="list-group-item"><span><i className="bi bi-geo-fill"></i></span> {location}</li>
                    <li className="list-group-item"><span>Equipment:</span> {equipment}</li>
                </ul>
            </div>
        </div>
    );
};

export default Card;