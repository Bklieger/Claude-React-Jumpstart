import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Boxes, Cpu, Network, Lightbulb, ArrowRight } from 'lucide-react'

const LLMModel = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [step, setStep] = useState(0);

  const steps = [
    {
      name: "Tokenization",
      icon: <Boxes />,
      description: "The input text is broken down into tokens (words or subwords). This process converts the raw text into a format the model can understand.",
      example: input ? input.split(' ').map((word, i) => <span key={i} className="bg-blue-100 px-1 mr-1 rounded">{word}</span>) : null
    },
    {
      name: "Embedding",
      icon: <Cpu />,
      description: "Each token is converted into a numerical vector representation. This allows the model to process the text mathematically.",
      example: <div className="grid grid-cols-4 gap-2">
        {input.split(' ').slice(0, 4).map((_, i) => 
          <div key={i} className="bg-green-100 p-2 rounded text-xs">
            [0.2, -0.5, 0.8, ...]
          </div>
        )}
      </div>
    },
    {
      name: "Attention Mechanism",
      icon: <Network />,
      description: "The model calculates attention scores to understand the relationships between different parts of the input.",
      example: <div className="grid grid-cols-4 gap-2">
        {input.split(' ').slice(0, 4).map((word, i) => 
          <div key={i} className="bg-yellow-100 p-2 rounded text-xs flex flex-col items-center">
            <span>{word}</span>
            <ArrowRight className="my-1" size={16} />
            <span className="font-bold">{(Math.random() * 0.5 + 0.5).toFixed(2)}</span>
          </div>
        )}
      </div>
    },
    {
      name: "Feed Forward",
      icon: <Network />,
      description: "The embedded and attention-weighted inputs are processed through multiple neural network layers.",
      example: <div className="flex justify-center">
        <Network size={64} className="text-purple-500" />
      </div>
    },
    {
      name: "Output Generation",
      icon: <Lightbulb />,
      description: "The model generates output tokens based on the processed input and the temperature setting.",
      example: output ? <div className="bg-red-100 p-2 rounded">{output}</div> : null
    }
  ];

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleNextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setOutput(generateOutput(input));
    }
  };

  const handleReset = () => {
    setInput('');
    setOutput('');
    setStep(0);
  };

  const generateOutput = (input) => {
    // This is a simplified simulation of output generation
    const words = input.split(' ');
    const outputLength = Math.floor(Math.random() * 5) + words.length;
    let output = '';
    for (let i = 0; i < outputLength; i++) {
        output += words[Math.floor(Math.random() * words.length)] + ' ';
    }
    return output.trim();
  };

  return (
    <Card className="w-[500px] mx-auto">
      <CardHeader>
        <CardTitle>Enhanced LLM Interactive Model</CardTitle>
        <CardDescription>Explore how LLMs process and generate text</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Input Text:</label>
            <Input 
              value={input} 
              onChange={handleInputChange}
              placeholder="Enter your text here"
            />
          </div>
          <div className="border p-4 rounded-md">
            <div className="flex items-center mb-2">
              {steps[step].icon}
              <h3 className="text-lg font-semibold ml-2">{steps[step].name}</h3>
            </div>
            <p className="text-sm mb-2">{steps[step].description}</p>
            <div className="bg-gray-100 p-2 rounded">
              {steps[step].example}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={handleNextStep}>
          {step < steps.length - 1 ? 'Next Step' : 'Generate Output'}
        </Button>
        <Button variant="outline" onClick={handleReset}>Reset</Button>
      </CardFooter>
    </Card>
  );
};

export default LLMModel;