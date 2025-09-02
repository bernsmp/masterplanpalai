"use client" 

import * as React from "react"
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ButtonProps } from "@/components/ui/button";
import { MousePointerClick } from "lucide-react";

interface ParticleButtonProps extends ButtonProps {
    onSuccess?: () => void;
    successDuration?: number;
}

function SuccessParticles({
    buttonRef,
}: {
    buttonRef: React.RefObject<HTMLButtonElement>;
}) {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return null;

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    return (
        <AnimatePresence>
            {[...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="fixed w-2 h-2 bg-[#ffb829] rounded-full shadow-lg"
                    style={{ left: centerX, top: centerY }}
                    initial={{
                        scale: 0,
                        x: 0,
                        y: 0,
                    }}
                    animate={{
                        scale: [0, 1, 0],
                        x: [0, (i % 2 ? 1 : -1) * (Math.random() * 50 + 20)],
                        y: [0, -Math.random() * 50 - 20],
                    }}
                    transition={{
                        duration: 1.2,
                        delay: i * 0.1,
                        ease: "easeOut",
                    }}
                />
            ))}
        </AnimatePresence>
    );
}

function ParticleButton({
    children,
    onClick,
    onSuccess,
    successDuration = 1000,
    className,
    ...props
}: ParticleButtonProps) {
    const [showParticles, setShowParticles] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const divRef = useRef<HTMLDivElement>(null);

    // Check if asChild is being used
    const isAsChild = 'asChild' in props && props.asChild;

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
        setShowParticles(true);

        // For asChild (Link), prevent immediate navigation to show animation
        if (isAsChild) {
            e.preventDefault();
            
            // Show particles for longer, then navigate
            setTimeout(() => {
                setShowParticles(false);
                // Navigate after animation completes
                const childElement = children as React.ReactElement;
                if (childElement.props && typeof childElement.props === 'object' && 'href' in childElement.props) {
                    window.location.href = (childElement.props as any).href;
                }
            }, 1500); // Longer duration to see the animation
        } else {
            // Call the original onClick if it exists
            if (onClick) {
                onClick(e);
            }

            setTimeout(() => {
                setShowParticles(false);
            }, successDuration);
        }
    };

    // For asChild, we need to handle the click on the child component
    if (isAsChild) {
        // Clone the children and add onClick handler
        const childWithClick = React.cloneElement(children as React.ReactElement, {
            onClick: (e: React.MouseEvent) => {
                handleClick(e as any);
                // Call the original onClick if it exists
                const childElement = children as React.ReactElement;
                if (childElement.props && typeof childElement.props === 'object' && 'onClick' in childElement.props) {
                    (childElement.props as any).onClick(e);
                }
            }
        } as any);

        // Remove asChild from props to avoid conflicts
        const { asChild, ...buttonProps } = props;

        return (
            <>
                {showParticles && <SuccessParticles buttonRef={divRef as unknown as React.RefObject<HTMLButtonElement>} />}
                <div
                    ref={divRef}
                    className={cn(
                        "relative inline-block",
                        showParticles && "scale-95",
                        "transition-transform duration-100"
                    )}
                >
                    <Button {...buttonProps} className={className}>
                        {childWithClick}
                        <MousePointerClick className="h-4 w-4" />
                    </Button>
                </div>
            </>
        );
    }

    return (
        <>
            {showParticles && <SuccessParticles buttonRef={buttonRef as unknown as React.RefObject<HTMLButtonElement>} />}
            <Button
                ref={buttonRef}
                onClick={handleClick}
                className={cn(
                    "relative",
                    showParticles && "scale-95",
                    "transition-transform duration-100",
                    className
                )}
                {...props}
            >
                {children}
                <MousePointerClick className="h-4 w-4" />
            </Button>
        </>
    );
}

export { ParticleButton }