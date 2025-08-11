import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ActivityLog } from '@/api/entities';

export default function LogViewer() {
    const [logs, setLogs] = useState([]);
    useEffect(() => {
        ActivityLog.list('-created_date', 100).then(setLogs);
    }, []);

    return (
        <Card><CardHeader><CardTitle>Recent Activities</CardTitle></CardHeader><CardContent>
            <div className="rounded-md border"><Table><TableHeader><TableRow>
                <TableHead>Date</TableHead><TableHead>User</TableHead><TableHead>Activity</TableHead><TableHead>Description</TableHead>
            </TableRow></TableHeader><TableBody>{logs.map(log => (
                <TableRow key={log.id}>
                    <TableCell>{new Date(log.created_date).toLocaleString()}</TableCell>
                    <TableCell>{log.created_by}</TableCell>
                    <TableCell>{log.activity_type.replace(/_/g, ' ')}</TableCell>
                    <TableCell>{log.description}</TableCell>
                </TableRow>
            ))}</TableBody></Table></div>
        </CardContent></Card>
    );
}