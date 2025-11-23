"use client"
import { useState, useEffect } from "react"
import PixelBlast from "../animations/PixelBlast";

interface OnboardingProps {
    onFinish: (user: { name: string; ip: string }) => void
}

export default function Onboarding({ onFinish }: OnboardingProps) {
    const [step, setStep] = useState(1)
    const [name, setName] = useState("")
    const [ip, setIp] = useState("")

    useEffect(() => {
        async function fetchIP() {
            try {
                const res = await fetch("https://api.ipify.org?format=json")
                const data = await res.json()
                setIp(data.ip)
            } catch {
                setIp("0.0.0.0")
            }
        }
        fetchIP()
    }, [])

    const handleStart = () => {
        if (name.trim().length < 2) return
        const userData = { name, ip }

        localStorage.setItem("user", JSON.stringify(userData))
        onFinish(userData)
    }

    return (
        <>
            <div style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: -1, overflow: 'hidden' }}>
                <PixelBlast
                    variant="circle"
                    pixelSize={6}
                    color="#1cca87"
                    patternScale={3}
                    patternDensity={1.2}
                    pixelSizeJitter={0.5}
                    enableRipples
                    rippleSpeed={0.4}
                    rippleThickness={0.12}
                    rippleIntensityScale={1.5}
                    liquid={false}
                    liquidStrength={0.12}
                    liquidRadius={1.2}
                    liquidWobbleSpeed={5}
                    speed={0.6}
                    edgeFade={0.25}
                    transparent
                />
            </div>
            <div className="onboarding-container">
                <div className="onboarding-card">

                    {step === 1 && (
                        <>
                            <h1 className="onboarding-title">¡Hola!</h1>
                            <p className="onboarding-text">Bienvenido a tu gestor de tareas</p>

                            <button className="onboarding-btn" onClick={() => setStep(2)}>
                                Estoy bien 😊
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <h2 className="onboarding-title">¿Cuál es tu nombre?</h2>
                            <p>Quiero recordarte cuando vuelvas por acá 😊</p>

                            <input
                                className="onboarding-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Escribe tu nombre..."
                            />

                            <button
                                className="onboarding-btn"
                                onClick={() => setStep(3)}
                                disabled={name.trim().length < 2}
                            >
                                Continuar
                            </button>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <h2 className="onboarding-title">Términos de uso</h2>

                            <p className="onboarding-text">
                                La aplicacion es completamente gratuita y no recopila ningun dato personal mas alla de tu nombre e IP.
                            </p><br />

                            <p className="onboarding-text">
                                Si entras desde otro dispositivo no podre recuperar las tareas automaticamente pero tienes una opcion de exportar los datos para añadirlas sin complicaciones.
                            </p>

                            <button className="onboarding-btn" onClick={handleStart}>
                                Aceptar y continuar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
