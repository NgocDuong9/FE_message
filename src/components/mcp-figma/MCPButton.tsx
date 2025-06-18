import React from 'react';
import { useFigmaData } from './useFigmaData';
import { MCP_CONFIG } from './config';

interface MCPButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const MCPButton: React.FC<MCPButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  ...props
}) => {
  const { data, loading, error } = useFigmaData(MCP_CONFIG.nodes.button);

  // Sử dụng styles từ Figma nếu có, nếu không thì dùng default styles
  const getButtonStyles = () => {
    if (loading || error || !data) {
      return {
        backgroundColor: MCP_CONFIG.defaultStyles.colors[variant],
        padding: MCP_CONFIG.defaultStyles.spacing[size],
        borderRadius: MCP_CONFIG.defaultStyles.borderRadius.md,
        fontSize: MCP_CONFIG.defaultStyles.typography.fontSize[size],
      };
    }

    // TODO: Parse styles từ Figma data
    return {};
  };

  return (
    <button
      className={`mcp-button ${className}`}
      style={getButtonStyles()}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? <span className="loading-spinner" /> : children}
    </button>
  );
};
