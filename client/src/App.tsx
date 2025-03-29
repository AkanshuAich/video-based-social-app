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
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Simple initialization and server connectivity check
    const checkServer = async () => {
      try {
        console.log('Attempting to connect to server...');
        const response = await fetch('/api/users');
        
        if (response.ok) {
          console.log('Successfully connected to server');
          setStatus('success');
        } else {
          const errorText = await response.text();
          console.error(`Failed to connect to server: ${response.status} - ${errorText}`);
          setErrorMessage(`Server responded with error: ${response.status} ${response.statusText}`);
          setStatus('error');
        }
      } catch (error) {
        console.error('Error connecting to server:', error);
        setErrorMessage(error instanceof Error ? error.message : 'Unknown error connecting to server');
        setStatus('error');
      }
    };
    
    checkServer();
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <h2 className="text-2xl font-bold text-primary mb-6">Loading VoiceWave</h2>
        <div className="flex space-x-2">
          <div className="w-4 h-24 bg-primary rounded-full animate-[wave_1.2s_ease-in-out_0s_infinite]"></div>
          <div className="w-4 h-24 bg-primary rounded-full animate-[wave_1.2s_ease-in-out_0.2s_infinite]"></div>
          <div className="w-4 h-24 bg-primary rounded-full animate-[wave_1.2s_ease-in-out_0.4s_infinite]"></div>
          <div className="w-4 h-24 bg-primary rounded-full animate-[wave_1.2s_ease-in-out_0.6s_infinite]"></div>
          <div className="w-4 h-24 bg-primary rounded-full animate-[wave_1.2s_ease-in-out_0.8s_infinite]"></div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <div className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-destructive mb-4">Connection Error</h2>
          <p className="text-card-foreground mb-6">{errorMessage || 'Unable to connect to the server. Please try again later.'}</p>
          <button 
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
            onClick={() => window.location.reload()}
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

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
