import React from 'react';
import type { WindowEditorConfig } from '@/hooks/useWindowEditorAPI';

interface HeaderBrandingProps {
  branding?: WindowEditorConfig['branding'];
}

const HeaderBranding: React.FC<HeaderBrandingProps> = ({ branding }) => {
  // If custom header content is provided, use it
  if (branding?.customHeaderContent) {
    return (
      <div 
        className="flex items-center"
        dangerouslySetInnerHTML={{ __html: branding.customHeaderContent }}
      />
    );
  }

  // If logo is provided
  if (branding?.logoUrl) {
    return (
      <div className="flex items-center gap-3">
        <img 
          src={branding.logoUrl} 
          alt={branding.logoAlt || 'Logo'} 
          className="h-8 max-w-48 object-contain"
        />
        {!branding.hideTitle && (
          <h1 className="text-2xl font-headline text-primary">
            {branding.title || 'Mailcraft'}
          </h1>
        )}
      </div>
    );
  }

  // Default title (with custom title if provided)
  return (
    <h1 className="text-2xl font-headline text-primary">
      {branding?.title || 'Mailcraft'}
    </h1>
  );
};

export default HeaderBranding;
