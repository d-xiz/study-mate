import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <main>
            <h1>404 - Page Not Found</h1>
            <Link to="/">Go back to Home</Link>
        </main>
    );
};

export default NotFoundPage;
