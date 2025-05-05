import { useAuth } from "../../context/auth.context"

const ProtectRouter = ({ children, onlyBiz = false }) => {
    const { user } = useAuth();
    if (!user || (onlyBiz && !user.biz)) {
        return null;
    }

    return children;
}

export default ProtectRouter;