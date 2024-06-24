import React, { useState, useEffect } from 'react';
import { Star, AlertCircle, HelpCircle, Plus, Trash2, BarChart2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const criteriaInfo = {
  caseControl: {
    selection: [
      "Is the case definition adequate?",
      "Representativeness of the cases",
      "Selection of Controls",
      "Definition of Controls"
    ],
    comparability: ["Comparability of cases and controls on the basis of the design or analysis"],
    exposure: [
      "Ascertainment of exposure",
      "Same method of ascertainment for cases and controls",
      "Non-Response rate"
    ]
  },
  cohort: {
    selection: [
      "Representativeness of the exposed cohort",
      "Selection of the non exposed cohort",
      "Ascertainment of exposure",
      "Demonstration that outcome of interest was not present at start of study"
    ],
    comparability: ["Comparability of cohorts on the basis of the design or analysis"],
    outcome: [
      "Assessment of outcome",
      "Was follow-up long enough for outcomes to occur",
      "Adequacy of follow up of cohorts"
    ]
  }
};

const tooltips = {
  // ... (tooltips content remains unchanged)
};

const StudyAssessment = ({ type, onScoreUpdate }) => {
  const [scores, setScores] = useState({
    selection: [0, 0, 0, 0],
    comparability: [0],
    [type === 'caseControl' ? 'exposure' : 'outcome']: [0, 0, 0]
  });

  useEffect(() => {
    onScoreUpdate(scores);
  }, [scores, onScoreUpdate]);

  const updateScore = (category, index, value) => {
    setScores(prevScores => {
      const newScores = { ...prevScores };
      newScores[category][index] = value;
      return newScores;
    });
  };

  const renderStars = (category, index, maxStars) => {
    const stars = [];
    for (let i = 0; i < maxStars; i++) {
      stars.push(
        <Star
          key={i}
          size={20}
          fill={i < scores[category][index] ? "gold" : "none"}
          color={i < scores[category][index] ? "gold" : "gray"}
          onClick={() => updateScore(category, index, i + 1)}
          className="cursor-pointer"
        />
      );
    }
    return stars;
  };

  const totalScore = Object.values(scores).flat().reduce((a, b) => a + b, 0);

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>{type === 'caseControl' ? 'Case-Control' : 'Cohort'} Study Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(criteriaInfo[type]).map(([category, criteria]) => (
            <div key={category}>
              <h3 className="font-bold capitalize">{category}</h3>
              <div className="ml-4 space-y-2">
                {criteria.map((criterion, index) => (
                  <div key={index} className="flex items-center">
                    <span className="mr-2">{index + 1}. {criterion}</span>
                    {renderStars(category, index, category === 'comparability' ? 2 : 1)}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle size={16} className="ml-2 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{tooltips[type][category][index]}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Total Score</AlertTitle>
            <AlertDescription>
              {totalScore} out of 9 stars
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
    </Card>
  );
};

const TrafficLightPlot = ({ scores }) => {
  const data = Object.entries(scores).map(([domain, scoreArray]) => ({
    domain,
    risk: scoreArray.reduce((a, b) => a + b, 0) / scoreArray.length > 0.5 ? 'Low' : 'High'
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" domain={[0, 1]} hide />
        <YAxis dataKey="domain" type="category" />
        <Bar dataKey="risk" fill={(d) => d.risk === 'Low' ? '#4CAF50' : '#F44336'} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const WeightedBarPlot = ({ allScores }) => {
  const domains = Object.keys(criteriaInfo.caseControl);
  const data = domains.map(domain => {
    const domainScores = allScores.map(score => score[domain]).flat();
    const total = domainScores.length;
    const low = domainScores.filter(score => score > 0).length;
    const high = total - low;
    return {
      domain,
      'Low Risk': (low / total) * 100,
      'High Risk': (high / total) * 100
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" unit="%" />
        <YAxis dataKey="domain" type="category" />
        <Legend />
        <Bar dataKey="Low Risk" stackId="a" fill="#4CAF50" />
        <Bar dataKey="High Risk" stackId="a" fill="#F44336" />
      </BarChart>
    </ResponsiveContainer>
  );
};

const RiskOfBiasAssessmentTool = () => {
  const [studies, setStudies] = useState([{ id: 1, type: 'caseControl', name: 'Study 1', scores: {} }]);
  const [currentStudy, setCurrentStudy] = useState(1);

  const addStudy = () => {
    const newStudy = {
      id: studies.length + 1,
      type: 'caseControl',
      name: `Study ${studies.length + 1}`,
      scores: {}
    };
    setStudies([...studies, newStudy]);
    setCurrentStudy(newStudy.id);
  };

  const removeStudy = (id) => {
    const newStudies = studies.filter(study => study.id !== id);
    setStudies(newStudies);
    if (currentStudy === id) {
      setCurrentStudy(newStudies[0]?.id || null);
    }
  };

  const updateStudyScores = (scores) => {
    setStudies(prevStudies => prevStudies.map(study => 
      study.id === currentStudy ? { ...study, scores } : study
    ));
  };

  const currentStudyData = studies.find(study => study.id === currentStudy);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Risk of Bias Assessment Tool</h1>
      <div className="mb-4">
        <Button onClick={addStudy} className="mr-2">
          <Plus size={16} className="mr-2" />
          Add Study
        </Button>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4 pr-4 mb-4 md:mb-0">
          <h2 className="text-lg font-semibold mb-2">Studies</h2>
          <ul className="space-y-2">
            {studies.map(study => (
              <li key={study.id} className={`flex items-center justify-between p-2 ${currentStudy === study.id ? 'bg-gray-100' : ''}`}>
                <span className="cursor-pointer" onClick={() => setCurrentStudy(study.id)}>
                  {study.name}
                </span>
                <Button variant="ghost" size="icon" onClick={() => removeStudy(study.id)}>
                  <Trash2 size={16} />
                </Button>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full md:w-3/4">
          {currentStudy && (
            <Tabs defaultValue="assessment" className="w-full">
              <TabsList>
                <TabsTrigger value="assessment">Assessment</TabsTrigger>
                <TabsTrigger value="visualizations">Visualizations</TabsTrigger>
              </TabsList>
              <TabsContent value="assessment">
                <StudyAssessment 
                  type={currentStudyData.type} 
                  onScoreUpdate={updateStudyScores}
                />
              </TabsContent>
              <TabsContent value="visualizations">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk of Bias Visualizations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-semibold mb-2">Traffic Light Plot</h3>
                    <TrafficLightPlot scores={currentStudyData.scores} />
                    <h3 className="text-lg font-semibold mt-4 mb-2">Weighted Bar Plot</h3>
                    <WeightedBarPlot allScores={studies.map(study => study.scores)} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskOfBiasAssessmentTool;
