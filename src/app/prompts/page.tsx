'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { mockPromptVersions, visibleCharacters, getPromptsByCharacter } from '@/data/mockData';

export default function PromptsPage() {
  const [selectedCharacterId, setSelectedCharacterId] = useState(visibleCharacters[0].id);
  const characterPrompts = useMemo(() => getPromptsByCharacter(selectedCharacterId), [selectedCharacterId]);

  const [selectedPrompt, setSelectedPrompt] = useState(characterPrompts[0]);
  const [editedContent, setEditedContent] = useState(selectedPrompt?.content || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleCharacterChange = (characterId: string) => {
    setSelectedCharacterId(characterId);
    const prompts = getPromptsByCharacter(characterId);
    if (prompts.length > 0) {
      setSelectedPrompt(prompts[0]);
      setEditedContent(prompts[0].content);
    }
  };

  const handlePromptSelect = (promptId: string) => {
    const prompt = mockPromptVersions.find(p => p.id === promptId);
    if (prompt) {
      setSelectedPrompt(prompt);
      setEditedContent(prompt.content);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    alert('保存しました（Mock）');
    setIsSaving(false);
  };

  const selectedCharacter = visibleCharacters.find(c => c.id === selectedCharacterId);

  return (
    <div className="h-full animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Prompt Editor</h1>
          <p className="text-slate-500">Manage and edit character prompts</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Export
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Character Tabs */}
      <div className="mb-6 flex gap-2 p-1 bg-white rounded-xl shadow-sm border border-slate-200/60">
        {visibleCharacters.map((char) => (
          <button
            key={char.id}
            onClick={() => handleCharacterChange(char.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
              selectedCharacterId === char.id
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
              <Image src={char.avatarUrl} alt={char.displayName} width={32} height={32} className="w-full h-full object-cover" />
            </div>
            <span>{char.displayName}</span>
            <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
              selectedCharacterId === char.id
                ? 'bg-white/20 text-white'
                : 'bg-slate-200 text-slate-600'
            }`}>
              {getPromptsByCharacter(char.id).length}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-300px)]">
        {/* Sidebar - Version List */}
        <div className="col-span-3 bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Versions</h2>
            <span className="text-xs text-slate-400">{characterPrompts.length} total</span>
          </div>

          <div className="space-y-2">
            {characterPrompts.map((prompt) => (
              <button
                key={prompt.id}
                onClick={() => handlePromptSelect(prompt.id)}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  selectedPrompt?.id === prompt.id
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-800">{prompt.version}</span>
                  {prompt.isActive && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 line-clamp-1">{prompt.description}</p>
                <p className="text-xs text-slate-400 mt-2">
                  {new Date(prompt.createdAt).toLocaleDateString('ja-JP')}
                </p>
              </button>
            ))}
          </div>

          <button className="w-full mt-4 p-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-indigo-400 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Version
          </button>
        </div>

        {/* Editor */}
        <div className="col-span-9 bg-white rounded-2xl shadow-sm border border-slate-200/60 flex flex-col overflow-hidden">
          {selectedPrompt ? (
            <>
              {/* Editor Header */}
              <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg">
                      <Image src={selectedCharacter?.avatarUrl || ''} alt={selectedCharacter?.displayName || ''} width={48} height={48} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-slate-800">{selectedPrompt.version}</h2>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600">{selectedCharacter?.displayName}</span>
                      </div>
                      <p className="text-sm text-slate-500">
                        {selectedPrompt.description} · {new Date(selectedPrompt.createdAt).toLocaleString('ja-JP')}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!selectedPrompt.isActive && (
                      <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Activate
                      </button>
                    )}
                    <button className="px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      Preview
                    </button>
                    <button className="px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      Diff
                    </button>
                  </div>
                </div>
              </div>

              {/* Editor Body */}
              <div className="flex-1 p-6">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-full p-4 bg-slate-900 text-slate-100 rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                  placeholder="Enter system prompt..."
                  spellCheck={false}
                />
              </div>

              {/* Editor Footer */}
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    {editedContent.length.toLocaleString()} chars
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    {editedContent.split('\n').length} lines
                  </span>
                </div>
                {editedContent !== selectedPrompt.content && (
                  <span className="flex items-center gap-1 text-amber-600 text-sm font-medium">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                    Unsaved changes
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-slate-500 font-medium">No prompts found</p>
                <p className="text-slate-400 text-sm mt-1">Create a new prompt for this character</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
