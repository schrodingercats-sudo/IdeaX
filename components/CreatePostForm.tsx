
import React, { useState, useCallback } from 'react';
import { PostFormData, PostType, Stage, Difficulty, PotentialImpact } from '../types';
import { UploadCloud, File, X, ChevronLeft, ChevronRight, Send, ChevronDown } from 'lucide-react';
import { fileToBase64, generateVideoThumbnail } from '../utils/media';

const TOTAL_STEPS = 5;

const initialFormData: PostFormData = {
  type: PostType.Idea,
  title: '',
  summary: '',
  content_md: '',
  tags: [],
  industries: [],
  stage: Stage.Idea,
  difficulty: Difficulty.Medium,
  potential_impact: PotentialImpact.Medium,
  is_reel: false,
  additionalMedia: [],
};

// Helper Components
const FormInput = (props: React.ComponentProps<'input'>) => (
  <input {...props} className="w-full bg-secondary px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" />
);

const FormTextarea = (props: React.ComponentProps<'textarea'>) => (
  <textarea {...props} className="w-full bg-secondary px-4 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none transition-shadow min-h-[120px]" />
);

const FormSelect = ({ children, ...props }: React.ComponentProps<'select'>) => (
  <div className="relative w-full">
    <select {...props} className="w-full bg-secondary pl-4 pr-10 py-3 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:outline-none appearance-none transition-shadow">
      {children}
    </select>
    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
  </div>
);

const TagInput: React.FC<{ value: string[], onChange: (value: string[]) => void, placeholder: string }> = ({ value, onChange, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ',' || e.key === 'Enter') {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (newTag && !value.includes(newTag)) {
        onChange([...value, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map(tag => (
          <div key={tag} className="flex items-center bg-accent text-accent-foreground text-sm font-medium px-3 py-1 rounded-full">
            {tag}
            <button onClick={() => removeTag(tag)} className="ml-2 text-accent-foreground/70 hover:text-accent-foreground">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      <FormInput
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    </div>
  );
};


export const CreatePostForm: React.FC<{ onSubmitSuccess: (formData: PostFormData) => void }> = ({ onSubmitSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PostFormData>(initialFormData);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const updateFormData = (field: keyof PostFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, TOTAL_STEPS));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting post:', formData);
    onSubmitSuccess(formData);
  };
  
  const handleCoverMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          updateFormData('coverMedia', file);

          setCoverPreview(null); // Reset preview
          if (file.type.startsWith('video/')) {
              try {
                  const thumb = await generateVideoThumbnail(file);
                  setCoverPreview(thumb);
              } catch (error) {
                  console.error("Could not generate thumbnail", error);
                  // Optionally set a fallback preview
              }
          } else {
              const previewUrl = await fileToBase64(file);
              setCoverPreview(previewUrl);
          }
      }
  };

  const isStep1Valid = formData.title.trim() !== '' && formData.summary.trim() !== '';

  const renderStep = () => {
    switch (currentStep) {
      case 1: // Type, Title, Summary
        return (
          <div className="space-y-6">
            <div>
              <label className="font-semibold mb-2 block">Post Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.values(PostType)).map(type => (
                  <button key={type} type="button" onClick={() => updateFormData('type', type)} className={`p-4 rounded-lg border-2 text-center capitalize transition-colors ${formData.type === type ? 'bg-primary text-background border-primary' : 'bg-secondary border-border hover:border-muted-foreground'}`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="title" className="font-semibold mb-2 block">Title</label>
              <FormInput id="title" placeholder="e.g., A new way to manage SaaS subscriptions" value={formData.title} onChange={e => updateFormData('title', e.target.value)} required />
            </div>
            <div>
              <label htmlFor="summary" className="font-semibold mb-2 block">Summary</label>
              <FormTextarea id="summary" placeholder="Briefly describe your post in a few sentences." value={formData.summary} onChange={e => updateFormData('summary', e.target.value)} required />
            </div>
          </div>
        );
      case 2: // Details
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="content_md" className="font-semibold mb-2 block">Detailed Content (Markdown supported)</label>
              <FormTextarea id="content_md" placeholder="Elaborate on your idea, problem, or solution..." value={formData.content_md} onChange={e => updateFormData('content_md', e.target.value)} required />
            </div>
            <div>
              <label className="font-semibold mb-2 block">Tags</label>
              <TagInput value={formData.tags} onChange={tags => updateFormData('tags', tags)} placeholder="Add tags (e.g., ai, fintech)..." />
            </div>
            <div>
              <label className="font-semibold mb-2 block">Industries</label>
              <TagInput value={formData.industries} onChange={industries => updateFormData('industries', industries)} placeholder="Add industries (e.g., SaaS)..." />
            </div>
          </div>
        );
      case 3: // Classification
        return (
          <div className="space-y-6">
            <div>
              <label htmlFor="stage" className="font-semibold mb-2 block">Stage</label>
              <FormSelect id="stage" value={formData.stage} onChange={e => updateFormData('stage', e.target.value)}>
                {Object.values(Stage).map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
              </FormSelect>
            </div>
            <div>
              <label htmlFor="difficulty" className="font-semibold mb-2 block">Difficulty</label>
              <FormSelect id="difficulty" value={formData.difficulty} onChange={e => updateFormData('difficulty', e.target.value)}>
                {Object.values(Difficulty).map(d => <option key={d} value={d} className="capitalize">{d}</option>)}
              </FormSelect>
            </div>
            <div>
              <label htmlFor="potential_impact" className="font-semibold mb-2 block">Potential Impact</label>
              <FormSelect id="potential_impact" value={formData.potential_impact} onChange={e => updateFormData('potential_impact', e.target.value)}>
                {Object.values(PotentialImpact).map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
              </FormSelect>
            </div>
          </div>
        );
      case 4: // Media
        return (
            <div className="space-y-6">
                 <div>
                    <label className="font-semibold mb-2 block">Cover Media</label>
                    <div className="relative w-full p-6 border-2 border-dashed border-border rounded-lg text-center cursor-pointer hover:border-primary">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Click or drag file to upload</p>
                        <input type="file" accept="image/*,video/*" className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" onChange={handleCoverMediaChange}/>
                    </div>
                    {coverPreview ? (
                      <div className="mt-4">
                        <p className="text-sm font-semibold mb-2">Preview:</p>
                        <img src={coverPreview} alt="Cover media preview" className="w-full max-w-sm mx-auto rounded-lg object-contain" />
                      </div>
                    ) : formData.coverMedia && (
                      <p className="mt-2 text-sm text-muted-foreground">Selected: {formData.coverMedia.name}</p>
                    )}
                </div>
                 <div>
                    <label className="font-semibold mb-2 block">Additional Media (Optional)</label>
                    <div className="relative w-full p-6 border-2 border-dashed border-border rounded-lg text-center cursor-pointer hover:border-primary">
                        <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                        <p className="mt-2 text-sm text-muted-foreground">Click or drag files to upload</p>
                        <input type="file" multiple className="opacity-0 absolute inset-0 w-full h-full cursor-pointer" onChange={(e) => e.target.files && updateFormData('additionalMedia', Array.from(e.target.files))}/>
                    </div>
                     {formData.additionalMedia.length > 0 && <div className="mt-2 text-sm text-muted-foreground">Selected: {formData.additionalMedia.map(f => f.name).join(', ')}</div>}
                </div>
                 <div className="flex items-center justify-between bg-secondary p-3 rounded-lg">
                    <label htmlFor="is_reel" className="font-semibold">Format as Reel (Vertical Video)</label>
                     <button type="button" role="switch" aria-checked={formData.is_reel} onClick={() => updateFormData('is_reel', !formData.is_reel)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.is_reel ? 'bg-primary' : 'bg-muted'}`}>
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.is_reel ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>
        );
      case 5: // Review
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Review Your Post</h3>
            {Object.entries(formData).map(([key, value]) => {
              if (key === 'coverMedia' || key === 'additionalMedia') return null;
              const displayValue = Array.isArray(value) ? value.join(', ') : String(value);
              return (
                 <div key={key} className="text-sm">
                   <strong className="capitalize mr-2">{key.replace('_', ' ')}:</strong> 
                   <span>{displayValue}</span>
                 </div>
              )
            })}
            {coverPreview && (
                <div className="mt-4">
                  <strong className="capitalize mr-2">Cover Media:</strong>
                  <img src={coverPreview} alt="Cover media preview" className="w-full max-w-xs mx-auto rounded-lg object-contain mt-2" />
                </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 md:p-6 h-full flex flex-col">
      <div className="mb-6">
        <div className="relative h-2 bg-secondary rounded-full">
          <div className="absolute top-0 left-0 h-2 bg-primary rounded-full transition-all duration-300" style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}></div>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">Step {currentStep} of {TOTAL_STEPS}</p>
      </div>

      <div className="flex-1">
        {renderStep()}
      </div>

      <div className="mt-6 flex justify-between items-center border-t border-border pt-4">
        <button type="button" onClick={handleBack} disabled={currentStep === 1} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed">
           <ChevronLeft size={16} /> Back
        </button>
        {currentStep < TOTAL_STEPS ? (
          <button 
            type="button" 
            onClick={handleNext} 
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-background font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentStep === 1 && !isStep1Valid}
          >
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button type="submit" className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600">
            Publish <Send size={16} />
          </button>
        )}
      </div>
    </form>
  );
};
