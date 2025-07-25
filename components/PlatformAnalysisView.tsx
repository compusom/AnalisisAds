import React, { useState } from 'react';
import { PLACEMENTS } from '../constants';
import { Recommendations } from './Recommendations';
import { AdPreview } from './AdPreview';
import { Modal } from './Modal';
import { AnalysisResult, CreativeSet, FormatGroup, OverallConclusion, ChecklistItem, Placement } from '../types';

const severityIcons: Record<ChecklistItem['severity'], JSX.Element> = {
    CRITICAL: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" /></svg>,
    ACTIONABLE: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>,
    POSITIVE: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>,
};


const ConclusionCard: React.FC<{ conclusion: OverallConclusion }> = ({ conclusion }) => {
    return (
        <div className="bg-brand-surface rounded-lg shadow-lg p-6 mt-8">
            <h2 className="text-xl md:text-2xl font-bold text-brand-text mb-4">{conclusion.headline}</h2>
            <ul className="space-y-3">
                {conclusion.checklist.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                        {severityIcons[item.severity]}
                        <span className="text-brand-text-secondary">{item.text}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};


const LoadingSkeleton: React.FC = () => (
     <div className="space-y-8 animate-pulse">
        <Recommendations analysisResult={null} isLoading={true} />
        <div className="bg-brand-surface rounded-lg shadow-lg p-4 md:p-6">
            <div className="h-6 bg-brand-border rounded w-1/2 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(6)].map((_, i) => (
                     <div key={i} className="flex flex-col h-full bg-brand-border rounded-lg p-4 space-y-3">
                        <div className="h-4 bg-brand-border/50 rounded w-3/4 self-center"></div>
                        <div className="flex-grow w-full aspect-[9/18] bg-brand-border/50 rounded-lg"></div>
                         <div className="h-16 bg-brand-border/50 rounded w-full"></div>
                     </div>
                ))}
            </div>
        </div>
        <div className="bg-brand-surface rounded-lg shadow-lg p-6 mt-8">
            <div className="h-6 bg-brand-border rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
                <div className="h-4 bg-brand-border rounded w-full"></div>
                <div className="h-4 bg-brand-border rounded w-5/6"></div>
                <div className="h-4 bg-brand-border rounded w-full"></div>
            </div>
        </div>
    </div>
);

interface PlatformAnalysisViewProps {
    formatGroup: FormatGroup;
    analysisResult: AnalysisResult | null;
    isLoading: boolean;
    onGoBack: () => void;
    creativeSet: CreativeSet;
}

export const PlatformAnalysisView: React.FC<PlatformAnalysisViewProps> = ({ formatGroup, analysisResult, isLoading, onGoBack, creativeSet }) => {
    const [selectedPlacementForModal, setSelectedPlacementForModal] = useState<Placement | null>(null);

    if (isLoading) {
        return <LoadingSkeleton />;
    }
    
    const placementsToShow = PLACEMENTS.filter(p => p.group === formatGroup);

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div>
                <button 
                    onClick={onGoBack} 
                    className="self-start mb-6 bg-brand-border/50 text-brand-text-secondary hover:bg-brand-border px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Seleccionar otro formato
                </button>
                <Recommendations analysisResult={analysisResult} isLoading={isLoading} />
            </div>
            
            <div className="bg-brand-surface rounded-lg shadow-lg p-4 md:p-6">
                 <h2 className="text-xl md:text-2xl font-bold text-brand-text mb-6">Previsualización en Formatos {formatGroup === 'SQUARE_LIKE' ? 'Cuadrados y Rectangulares' : 'Verticales'}</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {placementsToShow.map(placement => {
                        const summary = analysisResult?.placementSummaries.find(s => parseInt(s.placementId) === placement.id)?.summary;
                        return (
                           <AdPreview 
                                key={placement.id}
                                creativeSet={creativeSet}
                                placement={placement}
                                size="small"
                                criticalSummary={summary}
                                onClick={() => setSelectedPlacementForModal(placement)}
                            />
                        )
                    })}
                </div>
            </div>
            {analysisResult && <ConclusionCard conclusion={analysisResult.overallConclusion} />}
            <Modal isOpen={!!selectedPlacementForModal} onClose={() => setSelectedPlacementForModal(null)}>
                {selectedPlacementForModal && (
                    <AdPreview
                        creativeSet={creativeSet}
                        placement={selectedPlacementForModal}
                        size="large"
                    />
                )}
            </Modal>
        </div>
    );
};
