import React from 'react';
import Icon from '../../../components/AppIcon';
import { mobileClasses, cn } from '../../../utils/mobileOptimization';

const MetricCard = ({ title, value, subtitle, icon, trend, trendValue }) => {
  return (
    <div className={cn("bg-card border border-border rounded-lg overflow-hidden elevation-1 hover:elevation-3 transition-smooth", mobileClasses.cardCompact)}>
      <div className={cn("flex items-start justify-between", mobileClasses.marginBottomSmall)}>
        <div className="flex-1">
          <p className={cn("font-caption text-muted-foreground mb-0.5", mobileClasses.textTiny)}>
            {title}
          </p>
          <h3 className={cn("font-heading font-bold text-foreground", mobileClasses.heading3)}>
            {value}
          </h3>
          {subtitle && (
            <p className={cn("text-muted-foreground mt-0.5", mobileClasses.textTiny)}>
              {subtitle}
            </p>
          )}
        </div>
        <div className={cn("rounded-lg bg-muted flex items-center justify-center", mobileClasses.iconMedium)}>
          <Icon name={icon} className="w-4 h-4 sm:w-5 sm:h-5" color="var(--color-muted-foreground)" strokeWidth={2} />
        </div>
      </div>

      {trend && (
        <div className={cn("flex items-center pt-1.5 border-t border-border", mobileClasses.gapTiny)}>
          <Icon 
            name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
            className="w-3 h-3 sm:w-3.5 sm:h-3.5"
            color={trend === 'up' ? 'var(--color-success)' : 'var(--color-error)'}
            strokeWidth={2.5}
          />
          <span className={cn(`font-medium ${trend === 'up' ? 'text-success' : 'text-error'}`, mobileClasses.textTiny)}>
            {trendValue}%
          </span>
          <span className={cn("text-muted-foreground", mobileClasses.textTiny)}>bulan ini</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;