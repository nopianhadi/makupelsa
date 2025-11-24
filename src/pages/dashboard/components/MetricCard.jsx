import React from 'react';
import Icon from '../../../components/AppIcon';

const MetricCard = ({ title, value, subtitle, icon, trend, trendValue }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 elevation-1 hover:elevation-3 transition-smooth">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-xs font-caption text-muted-foreground mb-1">
            {title}
          </p>
          <h3 className="text-xl font-heading font-bold text-foreground">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
          <Icon name={icon} size={20} color="var(--color-muted-foreground)" strokeWidth={2} />
        </div>
      </div>

      {trend && (
        <div className="flex items-center gap-1.5 pt-2 border-t border-border">
          <Icon 
            name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
            size={14} 
            color={trend === 'up' ? 'var(--color-success)' : 'var(--color-error)'}
            strokeWidth={2.5}
          />
          <span className={`text-xs font-medium ${trend === 'up' ? 'text-success' : 'text-error'}`}>
            {trendValue}%
          </span>
          <span className="text-xs text-muted-foreground">bulan ini</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;