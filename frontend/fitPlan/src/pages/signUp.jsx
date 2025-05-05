
import Joi from 'joi'
import Input from "../commponets/common/input";
import PageHeader from "../commponets/common/pageHeader";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import '../styles/form.css';
import { useAuth } from '../context/auth.context'
import { Navigate } from 'react-router-dom';
import BizUsersService from '../services/bizUserService';

function SignUp({ closeModal, openModal }) {
    const [serverError, setServerError] = useState("");
    const [biz, setBiz] = useState(false);

    const handleBizSubmit = (status) => {
        setBiz(status);
    }

    const { user, signUp } = useAuth();

    const form = useFormik({
        validateOnMount: true,
        initialValues: {
            name: '',
            email: '',
            password: '',
            phone: '',
            image: {
                url: '',
                alt: '',
            },
            traineeLevel: '',
            isBusiness: biz
        },
        validate(values) {
            const schema = Joi.object({
                name: Joi.string().min(2).max(255).required(),
                email: Joi.string().min(6).max(255).required().email({ tlds: { allow: false } }),
                phone: Joi.string().pattern(/^\d{9,10}$/).required().messages({ "string.pattern.base": "Phone number must contain 9 to 10 digits only." }),
                password: Joi.string().min(6).max(255).required(),
                traineeLevel: Joi.string().required().valid("Beginner", "Advanced", "Pro"),
                image: Joi.object({
                    url: Joi.string().min(5).max(2048).uri().allow("").messages({
                        "string.uri": "Invalid URL format.",
                    }),
                    alt: Joi.string().min(5).max(2048).allow(""),
                }),
                isBusiness: Joi.boolean().default(biz),
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
        async onSubmit(values) {

            try {
                if (!values.isBusiness) {
                    const payload = { ...values };

                    delete payload.isBusiness;

                    if (payload.image) {
                        if (!payload.image.url) {
                            delete payload.image.url;
                        }
                        if (!payload.image.alt) {
                            delete payload.image.alt;
                        }
                    }

                    await signUp(payload)
                    closeModal()
                    openModal('login')
                } else {
                    const payload = { ...values };

                    delete payload.traineeLevel;
                    delete payload.isBusiness;

                    if (payload.image) {

                        if (!payload.image.url) {
                            delete payload.image.url;
                        }
                        if (!payload.image.alt) {
                            delete payload.image.alt;
                        }

                    }

                    await BizUsersService.createUser(payload);
                    closeModal()
                    openModal('login')
                }
            } catch (err) {
                if (err.response?.status === 400) {
                    setServerError(err.response.data)
                }
            }
        }
    });

    if (user) {
        return <Navigate to='/' />
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        closeModal();
    }

    return <>
        <div className="container">
            <PageHeader titel={"Sign Up"} description={"You have not account yet? Sign Up free "} />

            <form onSubmit={form.handleSubmit} className="m-4" noValidate>
                {serverError && <div className='alert alert-danger text-center'>{serverError}</div>}
                <Input
                    {...form.getFieldProps('name')}
                    label="Name"
                    type="text"
                    placeholder="Name"
                    required
                    error={form.touched.name && form.errors.name}
                />
                <Input
                    {...form.getFieldProps('email')}
                    label="Email"
                    type="email"
                    placeholder="Email"
                    required
                    error={form.touched.email && form.errors.email}
                />
                <Input
                    {...form.getFieldProps('password')}
                    label="Password"
                    type="password"
                    placeholder="Password"
                    required
                    error={form.touched.password && form.errors.password}
                />
                <Input
                    {...form.getFieldProps('phone')}
                    label="Phone"
                    type="text"
                    placeholder="Phone"
                    required
                    error={form.touched.phone && form.errors.phone}
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
                <button id='sendButton' type="submit" disabled={!form.isValid} className="btn btn-dark">Sign Up</button>
            </form>
            <button id='closeButton' className="btn btn-secondary" onClick={handleSubmit}>close</button>
        </div>
    </>
}

export default SignUp;