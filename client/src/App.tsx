import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ActiveRoom from "@/pages/active-room";
import Explore from "@/pages/explore";
import Profile from "@/pages/profile";
import Notifications from "@/pages/notifications";
import CreateRoom from "@/pages/create-room";
import MainLayout from "@/components/layout/MainLayout";
import { RoomProvider } from "@/contexts/RoomContext";
import { useEffect, useState } from "react";
import SettingsPage from "@/pages/settings/SettingsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/room/:id">
        {(params) => <ActiveRoom roomId={parseInt(params.id)} />}
      </Route>
      <Route path="/explore" component={Explore} />
      <Route path="/profile" component={Profile} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/create-room" component={CreateRoom} />
      <Route path="/settings" component={SettingsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // For hackathon demo purposes - no server connection required
  return (
    <QueryClientProvider client={queryClient}>
      <RoomProvider>
        <MainLayout>
          <Router />
        </MainLayout>
        <Toaster />
      </RoomProvider>
    </QueryClientProvider>
  );
}

export default App;
