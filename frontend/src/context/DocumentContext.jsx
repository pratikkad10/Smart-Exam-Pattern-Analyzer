import React, { createContext, useState, useEffect } from 'react';
import { documentService } from '../services/documentService';
import { useAuth } from '../hooks/useAuth';

export const DocumentContext = createContext(null);

export function DocumentProvider({ children }) {
    const { user } = useAuth();
    const [documents, setDocuments] = useState([]);
    const [activeDocument, setActiveDocument] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchDocuments = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await documentService.getDocuments();
            // Expecting data to be an array of documents or contain documents list
            const docsList = Array.isArray(data) ? data : (data.documents || []);
            setDocuments(docsList);
            
            // Set the first document as active if none is active
            if (docsList.length > 0 && !activeDocument) {
                // Try to find if there was a saved active document ID in localStorage
                const savedActiveId = localStorage.getItem('activeDocId');
                const matchedDoc = docsList.find(d => d.id === savedActiveId);
                setActiveDocument(matchedDoc || docsList[0]);
            }
        } catch (error) {
            console.error("Failed to fetch documents:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchDocuments();
        } else {
            setDocuments([]);
            setActiveDocument(null);
            localStorage.removeItem('activeDocId');
        }
    }, [user]);

    // Keep active document ID in localStorage
    useEffect(() => {
        if (activeDocument) {
            localStorage.setItem('activeDocId', activeDocument.id);
        } else {
            localStorage.removeItem('activeDocId');
        }
    }, [activeDocument]);

    const uploadDocument = async (file) => {
        setLoading(true);
        try {
            await documentService.uploadPDF(file);
            await fetchDocuments();
        } catch (error) {
            console.error("Failed to upload document:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <DocumentContext.Provider value={{
            documents,
            activeDocument,
            setActiveDocument,
            loading,
            fetchDocuments,
            uploadDocument
        }}>
            {children}
        </DocumentContext.Provider>
    );
}
