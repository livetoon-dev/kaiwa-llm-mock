'use client';

import { useState } from 'react';
import Image from 'next/image';
import { visibleCharacters } from '@/data/mockData';
import { Character } from '@/types';

export default function CharactersPage() {
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(visibleCharacters[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(selectedCharacter);

  const handleSave = () => {
    alert('保存しました（Mock）');
    setIsEditing(false);
  };

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Character Settings</h1>
          <p className="text-slate-500">Manage character profiles and attributes</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Character
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Character List */}
        <div className="col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200/60 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Characters</h2>
            <span className="text-xs text-slate-400">{visibleCharacters.length} total</span>
          </div>

          <div className="space-y-3">
            {visibleCharacters.map((char) => (
              <button
                key={char.id}
                onClick={() => {
                  setSelectedCharacter(char);
                  setEditForm(char);
                  setIsEditing(false);
                }}
                className={`w-full text-left p-4 rounded-xl transition-all ${
                  selectedCharacter.id === char.id
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg">
                    <Image src={char.avatarUrl} alt={char.displayName} width={56} height={56} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{char.displayName}</p>
                    <p className="text-sm text-slate-500">@{char.name}</p>
                    <div className="flex gap-1 mt-1">
                      {char.emotions.slice(0, 3).map((e, i) => (
                        <span key={i} className="text-xs px-1.5 py-0.5 bg-slate-200 rounded text-slate-600">{e}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Character Detail */}
        <div className="col-span-8 bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <div className="flex items-end justify-between">
              <div className="flex items-end gap-5">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-xl border-4 border-white/30">
                  <Image src={selectedCharacter.avatarUrl} alt={selectedCharacter.displayName} width={96} height={96} className="w-full h-full object-cover" />
                </div>
                <div className="pb-1">
                  <h2 className="text-2xl font-bold text-white">{selectedCharacter.displayName}</h2>
                  <p className="text-white/80">@{selectedCharacter.name}</p>
                </div>
              </div>
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-white/90 transition-colors font-medium"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Description
              </label>
              {isEditing ? (
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                />
              ) : (
                <p className="text-slate-600 bg-slate-50 p-4 rounded-xl leading-relaxed">{selectedCharacter.description}</p>
              )}
            </div>

            {/* Personality */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Personality Traits
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedCharacter.personality.map((trait, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-sm font-medium"
                  >
                    {trait}
                  </span>
                ))}
                {isEditing && (
                  <button className="px-4 py-2 border-2 border-dashed border-purple-300 rounded-full text-sm text-purple-500 hover:border-purple-400 hover:bg-purple-50 transition-colors">
                    + Add
                  </button>
                )}
              </div>
            </div>

            {/* Speech Patterns */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Speech Patterns (口癖)
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedCharacter.speechPatterns.map((pattern, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-mono"
                  >
                    「{pattern}」
                  </span>
                ))}
                {isEditing && (
                  <button className="px-4 py-2 border-2 border-dashed border-indigo-300 rounded-full text-sm text-indigo-500 hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
                    + Add
                  </button>
                )}
              </div>
            </div>

            {/* Emotions */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Available Emotions
              </label>
              <div className="flex flex-wrap gap-2">
                {selectedCharacter.emotions.map((emotion, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                  >
                    {emotion}
                  </span>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div className="pt-4 border-t border-slate-200">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Created</p>
                  <p className="font-medium text-slate-700">{new Date(selectedCharacter.createdAt).toLocaleString('ja-JP')}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-1">Last Updated</p>
                  <p className="font-medium text-slate-700">{new Date(selectedCharacter.updatedAt).toLocaleString('ja-JP')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
