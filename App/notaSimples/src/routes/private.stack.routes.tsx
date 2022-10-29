import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { searchClient } from "../pages/searchClient"; 

const StackRoutes = createNativeStackNavigator();

export const PrivateRoutes = () => (
    <StackRoutes.Navigator
        screenOptions={{
            headerShown: false
        }}
    >
        <StackRoutes.Screen name="searchClient" component={searchClient} />
    </StackRoutes.Navigator>
)