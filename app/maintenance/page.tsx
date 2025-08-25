"use client";

import ChecksheetPage from '@/components/view/maintenance/checksheetPage';
import React, { useEffect } from 'react';

export default function Page() {
    // Clean transient edit/new-entry data when landing on dashboard
    useEffect(() => {
        try {
            const keys = [
                'editMode',
                'editChecksheetId',
                'editProfile',
                'editParts',
                // Clear last working profile id to avoid linking parts to stale record
                'checksheetProfile',
            ];
            keys.forEach((k) => localStorage.removeItem(k));
        } catch {
            // no-op
        }
    }, []);
    return (
        <ChecksheetPage />
    );
};
