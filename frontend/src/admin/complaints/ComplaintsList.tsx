import React from "react";
import { List, Datagrid, TextField, DateField, EditButton } from "react-admin";

export const ComplaintsList: React.FC = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="title" label="Title" />
      <TextField source="status" label="Status" />
      <DateField source="createdAt" label="Created At" />
      <EditButton />
    </Datagrid>
  </List>
);

export const ComplaintEdit: React.FC = () => {
  return <div>Edit Complaint Form Here</div>; // Can integrate react-admin <Edit> component
};
