import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SearchClient } from "../pages/SearchClient"; 
import { NoteDetailing } from "../pages/NoteDetailing";

const StackRoutes = createNativeStackNavigator();

export const PrivateRoutes = () => (
    <StackRoutes.Navigator
        screenOptions={{
            headerShown: false
        }}
    >
        <StackRoutes.Screen name="SearchClient" component={SearchClient} />
        <StackRoutes.Screen name="NoteDetailing" component={NoteDetailing} />
    </StackRoutes.Navigator>
)