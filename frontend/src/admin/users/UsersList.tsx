import React from "react";
import { List, Datagrid, TextField, EmailField, EditButton } from "react-admin";

export const UsersList: React.FC = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="name" label="Name" />
      <EmailField source="email" label="Email" />
      <EditButton />
    </Datagrid>
  </List>
);

export const UserEdit: React.FC = () => {
  return <div>Edit User Form Here</div>; // Can integrate react-admin <Edit> component
};
