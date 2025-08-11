import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Plus } from 'lucide-react';

export default function AccountNotes({ debtorId }) {
  const [notes, setNotes] = useState([{ id: 'NOTE_1', content: 'Debtor agreed to payment plan.', created_by: 'Bayview Admin', created_date: '2024-01-15T08:15:00Z' }]);
  const [newNote, setNewNote] = useState('');

  return (
    <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileText/> Account Notes</CardTitle></CardHeader><CardContent className="space-y-4">
      <div className="space-y-3">{notes.map(note => (
        <div key={note.id} className="p-3 bg-secondary rounded-lg"><p>{note.content}</p><p className="text-xs text-muted-foreground mt-2">{note.created_by} on {new Date(note.created_date).toLocaleString()}</p></div>
      ))}</div>
      <div className="space-y-2"><Textarea placeholder="Add a new note..." value={newNote} onChange={e => setNewNote(e.target.value)} /><Button size="sm"><Plus className="w-4 h-4 mr-2"/>Add Note</Button></div>
    </CardContent></Card>
  );
}