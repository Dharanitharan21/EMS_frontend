import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import "../Styles/ChangePasswordForm.css";
import axios from "../Components/axiosInstance";


const validationSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(6, "Old password is required")
    .required("Old password is required"),
  newPassword: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords do not match")
    .required("Password confirmation is required"),
});

export default function ChangePasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

 const handleSubmit = async (values, { resetForm }) => {
  setIsSubmitting(true);
  try {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    const payload = {
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    };

    const res = await axios.patch(`https://employee-leave-management-x4wr.onrender.com/api/CHPW-users/${userId}/change-password`,payload);
    toast.success("Password changed successfully");
    resetForm();
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Failed to change password";
    toast.error(errorMsg);
    console.error(error);
  } finally {
    setIsSubmitting(false);
  }
};


  return (
      <div className="cp-changepasswwword-card">
        <div className="cp-pass-card-header">
          <h1>Change Password</h1>
        </div>
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="cp-change-password-form">
          <div className="cp-form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <Field
              type="password"
              id="currentPassword"
              name="currentPassword"
              placeholder="Enter your current password"
            />
            <ErrorMessage name="currentPassword" component="p" className="cp-error" />
          </div>

          <div className="cp-form-group">
            <label htmlFor="newPassword">New Password</label>
            <Field
              type="password"
              id="newPassword"
              name="newPassword"
              placeholder="Enter new password"
            />
            <ErrorMessage name="newPassword" component="p" className="cp-error" />
          </div>

          <div className="cp-form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <Field
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm new password"
            />
            <ErrorMessage name="confirmPassword" component="p" className="cp-error" />
          </div>

          <button type="submit" className="cp-submit-button" disabled={isSubmitting}>
            {isSubmitting ? "Changing Password..." : "Change Password"}
          </button>
        </Form>
      )}
    </Formik>
    </div>
  );
}
