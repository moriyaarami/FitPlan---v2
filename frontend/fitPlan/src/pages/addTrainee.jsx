import { useFormik } from "formik"
import { useState } from "react"
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import PageHeader from "../commponets/common/pageHeader";
import Input from "../commponets/common/input";
import Joi from "joi";
import TraineeServices from "../services/traineeServices";
import { useTrainees } from "../context/trainee.context";

function AddTrainee() {

    const [serverError, setServerError] = useState("");
    const [message, setMessage] = useState("")
    const { user } = useAuth();

    const { addTrainee } = useTrainees();

    const form = useFormik({
        validateOnMount: true,
        initialValues: {
            name: "",
            phone: "",
            password: "",
            traineeLevel: "",
            image: {
                url: "",
                alt: "",
            }
        },
        validate(values) {
            const schema = Joi.object({
                name: Joi.string().min(2).max(255).required(),
                phone: Joi.string().pattern(/^\d{9,10}$/).required().messages({ "string.pattern.base": "Phone number must contain 9 to 10 digits only." }),
                password: Joi.string().min(6).max(255).required(),
                traineeLevel: Joi.string().valid("Beginner", "Advanced", "Pro").required(),
                image: Joi.object({
                    url: Joi.string().min(5).max(2048).uri().allow("").messages({
                        "string.uri": "Invalid URL format.",
                    }),
                    alt: Joi.string().min(5).max(2048).allow(""),
                }),
            })

            const { error } = schema.validate(values, { abortEarly: false });
            if (!error) {
                return null;
            }

            const errors = {};
            for (const detail of error.details) {
                const key = detail.path.join(".");
                errors[key] = detail.message;
            }

            return errors;
        },
        async onSubmit(values, { resetForm }) {

            addTrainee(values, resetForm, setMessage, setServerError)

        }
    });

    if (!user) {
        return <Navigate to='/' />
    }

    return <div className="container">
        <PageHeader titel={"Add Trainee"} description={"Lets add a new trainee"} />

        <form onSubmit={form.handleSubmit} className="m-4" noValidate>
            {message && <div className="alert alert-secondary text-center">{message}</div>}
            {serverError && <div className="alert alert-danger text-center">{serverError}</div>}
            <Input
                {...form.getFieldProps('name')}
                label="Name"
                type="text"
                placeholder="name"
                required
                error={form.touched.name && form.errors.name}
            />
            <Input
                {...form.getFieldProps('phone')}
                label="Phone"
                type="text"
                placeholder="Phone"
                required
                error={form.touched.phone && form.errors.phone}
            />
            <Input
                {...form.getFieldProps('password')}
                label="Password"
                type="password"
                placeholder="Password"
                required
                error={form.touched.password && form.errors.password}
            />
            <h6>Image:</h6>
            <div className="d-flex gap-2">
                <Input
                    {...form.getFieldProps('image.url')}
                    label="image-url"
                    type="text"
                    placeholder="Image Url"
                    error={form.touched.image?.url && form.errors['image.url']}
                />
                <Input
                    {...form.getFieldProps('image.alt')}
                    label="image-alt"
                    type="text"
                    placeholder="Image Alt"
                    error={form.touched.image?.alt && form.errors['image.alt']}
                />

            </div>
            <div className=" mb-3">
                <label htmlFor="traineeLevel">Trainee Level</label>
                <span className="text-danger mx-1">*</span>
                <select
                    {...form.getFieldProps('traineeLevel')}
                    className="form-select"
                    id="traineeLevel"
                    required
                    error={form.touched.traineeLevel && form.errors.traineeLevel}
                >
                    <option defaultValue>Choose...</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Pro">Pro</option>
                </select>

            </div>
            <button id='sendButton' type="submit" disabled={!form.isValid} className="btn btn-dark" >Add Trainee</button>
        </form>
    </div>
}

export default AddTrainee