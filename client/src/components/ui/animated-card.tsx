import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardProps } from "@/components/ui/card"

interface AnimatedCardProps extends CardProps {
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const AnimatedCard = React.forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, delay = 0, direction = 'up', children, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);

    React.useEffect(() => {
      const timer = setTimeout(() => setIsVisible(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    const getTransformClass = () => {
      if (!isVisible) {
        switch (direction) {
          case 'up': return 'translate-y-8 opacity-0';
          case 'down': return '-translate-y-8 opacity-0';
          case 'left': return 'translate-x-8 opacity-0';
          case 'right': return '-translate-x-8 opacity-0';
          default: return 'translate-y-8 opacity-0';
        }
      }
      return 'translate-y-0 translate-x-0 opacity-100';
    };

    return (
      <Card
        ref={ref}
        className={cn(
          "transition-all duration-700 ease-out transform hover:scale-105 hover:shadow-lg",
          getTransformClass(),
          className
        )}
        {...props}
      >
        {children}
      </Card>
    );
  }
);

AnimatedCard.displayName = "AnimatedCard";

export { AnimatedCard };