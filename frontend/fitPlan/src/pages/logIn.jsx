import { useFormik } from "formik";
import Input from "../commponets/common/input";
import PageHeader from "../commponets/common/pageHeader";
import Joi from "joi"
import '../styles/form.css';
import { useState } from "react";
import { useAuth } from "../context/auth.context";

function LogIn({ closeModal }) {
    const { login, loginBiz } = useAuth();
    const [serverError, setServerError] = useState('');
    const [biz, setBiz] = useState(false);

    const handleBizSubmit = (status) => {
        setBiz(status);
    }

    const form = useFormik({
        validateOnMount: true,
        initialValues: {
            email: '',
            password: '',
            isBusiness: biz,
        },
        validate(values) {
            const schema = Joi.object({
                email: Joi.string().min(6).max(255).required().email({ tlds: { allow: false } }),
                password: Joi.string().min(6).max(255).required(),
                isBusiness: Joi.boolean().default(biz),
            });

            const { error } = schema.validate(values, { abortEarly: false });
            if (!error) {
                return null;
            }

            const errors = {}
            for (const detail of error.details) {
                const key = detail.path[0];
                errors[key] = detail.message;
            }

            return errors;

        },
        async onSubmit(values) {

            if (values.isBusiness) {
                const payload = { ...values };

                delete payload.isBusiness;

                try {

                    await loginBiz(payload);
                    closeModal();
                } catch (err) {
                    if (err.response?.status >= 400) {
                        setServerError(err.response.data);
                        setTimeout(() => setServerError(""), 3000)
                    }
                }
            } else {
                const payload = { ...values };

                delete payload.isBusiness
                try {
                    await login(payload);
                    closeModal();
                } catch (err) {
                    if (err.response?.status >= 400) {
                        setServerError(err.response.data);
                        setTimeout(() => setServerError(""), 3000)
                    }
                }
            }

        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        closeModal();
    }

    return <>
        <div className="container" >
            <PageHeader titel={"Log In"} description={"Log In to your account"} />


            <form onSubmit={form.handleSubmit} className="m-3" noValidate>
                {serverError && <div className="alert alert-danger">{serverError}</div>}
                <Input
                    {...form.getFieldProps('email')}
                    label="Email"
                    type="email"
                    required
                    error={form.touched.email && form.errors.email}

                />
                <Input
                    {...form.getFieldProps('password')}
                    label="Password"
                    type="password"
                    required
                    error={form.touched.password && form.errors.password}

                />
                <div className=" mb-3">
                    <label htmlFor="businessAcount">
                        <input
                            {...form.getFieldProps('isBusiness')}
                            className="form-check-input mx-2"
                            type="checkbox"
                            id="businessAcount"
                            onClick={(e) => {
                                handleBizSubmit(e.target.checked);
                            }}
                        />
                        Business Account
                    </label>
                </div>
                <button id="sendButton" type="submit" className="btn btn-dark" disabled={!form.isValid}>Log In</button>
            </form>
            <button id="closeButton" className="btn btn-secondary my-2" onClick={handleSubmit}>close</button>
        </div>
    </>
}

export default LogIn;