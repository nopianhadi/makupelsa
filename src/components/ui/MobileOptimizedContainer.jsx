import React from 'react';
import { mobileClasses, cn } from '../../utils/mobileOptimization';

export const PageContainer = ({ children, className }) => (
  <div className={cn("min-h-screen bg-background", className)}>
    <main className={cn("w-full max-w-7xl mx-auto pb-24 lg:pb-6", mobileClasses.container)}>
      {children}
    </main>
  </div>
);

export const PageHeader = ({ title, subtitle, actions, className }) => (
  <div className={cn(mobileClasses.marginBottomSmall, className)}>
    <div className="flex items-center justify-between mb-2 flex-col sm:flex-row gap-2 sm:gap-0">
      <div>
        <h1 className={cn("font-heading font-bold text-foreground", mobileClasses.heading1)}>
          {title}
        </h1>
        {subtitle && (
          <p className={cn("text-muted-foreground mt-0.5", mobileClasses.textSmall)}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div className={cn("flex items-center", mobileClasses.gapSmall)}>
          {actions}
        </div>
      )}
    </div>
  </div>
);

export const Card = ({ children, className }) => (
  <div className={cn("bg-card border border-border rounded-lg overflow-hidden elevation-1", mobileClasses.cardCompact, className)}>
    {children}
  </div>
);

export const CardHeader = ({ icon, title, subtitle, actions, className }) => (
  <div className={cn("flex items-center justify-between", mobileClasses.marginBottomSmall, className)}>
    <div className={cn("flex items-center", mobileClasses.gapSmall)}>
      {icon && (
        <div className={cn("rounded-lg flex items-center justify-center", mobileClasses.iconMedium)}>
          {icon}
        </div>
      )}
      <div>
        <h2 className={cn("font-heading font-semibold text-foreground truncate", mobileClasses.heading3)}>
          {title}
        </h2>
        {subtitle && (
          <p className={cn("text-muted-foreground", mobileClasses.textTiny)}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {actions}
  </div>
);
