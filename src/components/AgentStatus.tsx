import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Users, CheckCircle, XCircle } from 'lucide-react';
import { agentManager } from '@/lib/agents/AgentManager';

const AgentStatus: React.FC = () => {
  const [agentInfo, setAgentInfo] = useState<any>(null);
  const [healthStatus, setHealthStatus] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAgents = async () => {
      try {
        // Get agent information
        setAgentInfo(agentManager.getAgentInfo());

        // Check agent health
        const health = await agentManager.healthCheck();
        setHealthStatus(health);
      } catch (error) {
        console.error('Failed to initialize agents:', error);
        // Set default offline status
        setHealthStatus({
          quizMaster: false,
          vocabSensei: false, 
          examProctor: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeAgents();
  }, []);

  if (!agentInfo) return null;

  const agents = [
    {
      key: 'quizMaster',
      name: agentInfo.quizMaster.name,
      description: agentInfo.quizMaster.description,
      icon: '🎯',
      color: 'blue'
    },
    {
      key: 'vocabSensei', 
      name: agentInfo.vocabSensei.name,
      description: agentInfo.vocabSensei.description,
      icon: '🇩🇪',
      color: 'purple'
    },
    {
      key: 'examProctor',
      name: agentInfo.examProctor.name,
      description: agentInfo.examProctor.description,
      icon: '📊',
      color: 'orange'
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-[#0f6cbf]">
          <Users className="h-6 w-6 mr-2" />
          AI Agent System
        </CardTitle>
        <CardDescription>
          Specialized AI agents working together to create your learning experience
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div 
              key={agent.key}
              className="p-4 border rounded-lg bg-gradient-to-br from-gray-50 to-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{agent.icon}</span>
                  <div className="text-sm font-semibold text-gray-800">
                    {agent.name}
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  ) : healthStatus[agent.key] ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${
                      isLoading 
                        ? 'bg-blue-100 text-blue-800'
                        : healthStatus[agent.key] 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isLoading ? 'Checking...' : healthStatus[agent.key] ? 'Active' : 'Offline'}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                {agent.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-2 mb-1">
            <Brain className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">Agentic AI Features</span>
          </div>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Specialized expertise for each learning activity</li>
            <li>• Agent collaboration for enhanced content quality</li>
            <li>• Adaptive difficulty and personalized learning paths</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentStatus;