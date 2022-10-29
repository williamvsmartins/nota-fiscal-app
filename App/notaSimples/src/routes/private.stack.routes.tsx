import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SearchClient } from "../pages/SearchClient"; 

const StackRoutes = createNativeStackNavigator();

export const PrivateRoutes = () => (
    <StackRoutes.Navigator
        screenOptions={{
            headerShown: false
        }}
    >
        <StackRoutes.Screen name="SearchClient" component={SearchClient} />
    </StackRoutes.Navigator>
)