import React, { useState } from "react";
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import "./AuthModal.css";


const AuthModal = ({
                       showAuthModal,
                       setShowAuthModal,
                       authMode,
                       onSwitchMode,
                       blockClose = false,
                   }) => {
    const [email, setEmail]       = useState("");
    const [password, setPassword] = useState("");
    const [error, setError]       = useState("");
    const [loading, setLoading]   = useState(false);
    const navigate = useNavigate();

    const handleClose = () => !blockClose && setShowAuthModal(false);

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true); setError("");
        try {
            if (authMode === "Register") {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            handleClose();
            navigate("/");                       // после входа → домашний
        } catch (err) {
            setError(err.code.replace("auth/", "").replaceAll("-", " "));
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            show={showAuthModal}
            onHide={blockClose ? undefined : handleClose}
            centered
            backdrop={blockClose ? "static" : true}
            keyboard={!blockClose}
        >
            <Modal.Header closeButton={!blockClose}>
                <Modal.Title>
                    {authMode === "Register" ? "Регистрация" : "Вход"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleAuth}>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button
                        type="submit"
                        variant="primary"
                        disabled={loading}
                        className="w-100"
                    >
                        {loading ? (
                            <Spinner animation="border" size="sm" />
                        ) : authMode === "Register" ? (
                            "Зарегистрироваться"
                        ) : (
                            "Войти"
                        )}
                    </Button>
                </Form>

                {onSwitchMode && (
                    <div className="auth-toggle">
                        {authMode === "Login" ? (
                            <>
                                Нет аккаунта?{" "}
                                <button type="button" onClick={() => onSwitchMode("Register")}>
                                    Регистрация
                                </button>
                            </>
                        ) : (
                            <>
                                Уже есть аккаунт?{" "}
                                <button type="button" onClick={() => onSwitchMode("Login")}>
                                    Войти
                                </button>
                            </>
                        )}
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default AuthModal;
