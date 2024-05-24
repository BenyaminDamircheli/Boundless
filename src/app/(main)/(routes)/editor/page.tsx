"use client"
import Dagre from '@dagrejs/dagre';
import React, { useCallback, useState, useEffect, useRef } from "react";
import ReactFlow, { useReactFlow,Background, ReactFlowProvider, useNodesState, useEdgesState, addEdge, Connection, Handle, MarkerType } from "reactflow";
import 'reactflow/dist/style.css';
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import InitialNode from "@/components/customNode";
import NoteNode from "@/components/noteNode";
import Navbar1 from "@/components/sidebar";
import FlowTitle from "@/components/flowTitle";
import SubConceptNode from "@/components/subconceptNode";
import SubSubConceptNode from "@/components/subsubconcept";

// To remove reactFlow Attribution
type Viewport = {
  x: number;
  y: number;
  zoom: number;
};
const proOptions = { hideAttribution: true };
const defaultViewport: Viewport = { x: 0, y: 100, zoom: 0.048 };

const x1 = window.innerWidth / 2;
const y1 = window.innerHeight / 2;

const nodeTypes = {
    customNode: InitialNode,
    noteNode: NoteNode,
    subConceptNode: SubConceptNode,
    subSubConceptNode: SubSubConceptNode
}

const initialNodes = [ {
  id: '0',
  position: { x: 0, y: 0 },
  data: {
    title: 'Transformers and Neural Networks',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'noteNode'
},
{
  id: '1',
  position: { x: 0, y: 0 },
  data: {
    title: 'Introduction to Neural Networks',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'customNode'
},
{
  id: '2',
  position: { x: 0, y: 0 },
  data: {
    title: 'Definition and Basics',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '3',
  position: { x: 0, y: 0 },
  data: {
    title: 'Historical Context',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '4',
  position: { x: 0, y: 0 },
  data: {
    title: 'Applications',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '5',
  position: { x: 0, y: 0 },
  data: {
    title: 'Perceptrons and Activation Functions',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'customNode'
},
{
  id: '6',
  position: { x: 0, y: 0 },
  data: {
    title: 'Perceptron Model',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '7',
  position: { x: 0, y: 0 },
  data: {
    title: 'Activation Functions',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '8',
  position: { x: 0, y: 0 },
  data: { title: 'Sigmoid', status: 'In Progress', duedate: '2024-01-01' },
  type: 'subConceptNode'
},
{
  id: '9',
  position: { x: 0, y: 0 },
  data: { title: 'ReLU', status: 'In Progress', duedate: '2024-01-01' },
  type: 'subConceptNode'
},
{
  id: '10',
  position: { x: 0, y: 0 },
  data: { title: 'Tanh', status: 'In Progress', duedate: '2024-01-01' },
  type: 'subConceptNode'
},
{
  id: '11',
  position: { x: 0, y: 0 },
  data: { title: 'Softmax', status: 'In Progress', duedate: '2024-01-01' },
  type: 'subConceptNode'
},
{
  id: '12',
  position: { x: 0, y: 0 },
  data: {
    title: 'Feedforward Neural Networks',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'customNode'
},
{
  id: '13',
  position: { x: 0, y: 0 },
  data: {
    title: 'Architecture',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '14',
  position: { x: 0, y: 0 },
  data: {
    title: 'Forward Propagation',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '15',
  position: { x: 0, y: 0 },
  data: {
    title: 'Loss Functions',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '16',
  position: { x: 0, y: 0 },
  data: {
    title: 'Mean Squared Error',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '17',
  position: { x: 0, y: 0 },
  data: {
    title: 'Cross-Entropy',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '18',
  position: { x: 0, y: 0 },
  data: {
    title: 'Backpropagation',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'customNode'
},
{
  id: '19',
  position: { x: 0, y: 0 },
  data: {
    title: 'Gradient Descent',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '20',
  position: { x: 0, y: 0 },
  data: {
    title: 'Chain Rule',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '21',
  position: { x: 0, y: 0 },
  data: {
    title: 'Backpropagation Algorithm',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '22',
  position: { x: 0, y: 0 },
  data: {
    title: 'Training Neural Networks',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'customNode'
},
{
  id: '23',
  position: { x: 0, y: 0 },
  data: {
    title: 'Data Preparation',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '24',
  position: { x: 0, y: 0 },
  data: {
    title: 'Mini-Batch Gradient Descent',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '25',
  position: { x: 0, y: 0 },
  data: {
    title: 'Regularization Techniques',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '26',
  position: { x: 0, y: 0 },
  data: {
    title: 'L1 and L2 Regularization',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '27',
  position: { x: 0, y: 0 },
  data: { title: 'Dropout', status: 'In Progress', duedate: '2024-01-01' },
  type: 'subConceptNode'
},
{
  id: '28',
  position: { x: 0, y: 0 },
  data: {
    title: 'Hyperparameter Tuning',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '29',
  position: { x: 0, y: 0 },
  data: {
    title: 'Convolutional Neural Networks (CNNs)',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'customNode'
},
{
  id: '30',
  position: { x: 0, y: 0 },
  data: {
    title: 'Convolutional Layers',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '31',
  position: { x: 0, y: 0 },
  data: {
    title: 'Pooling Layers',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '32',
  position: { x: 0, y: 0 },
  data: {
    title: 'Applications in Image Processing',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '33',
  position: { x: 0, y: 0 },
  data: {
    title: 'Recurrent Neural Networks (RNNs)',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'customNode'
},
{
  id: '34',
  position: { x: 0, y: 0 },
  data: {
    title: 'Basic RNN Architecture',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '35',
  position: { x: 0, y: 0 },
  data: {
    title: 'Long Short-Term Memory (LSTM)',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '36',
  position: { x: 0, y: 0 },
  data: {
    title: 'Gated Recurrent Unit (GRU)',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '37',
  position: { x: 0, y: 0 },
  data: {
    title: 'Advanced Architectures',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'customNode'
},
{
  id: '38',
  position: { x: 0, y: 0 },
  data: {
    title: 'Autoencoders',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '39',
  position: { x: 0, y: 0 },
  data: {
    title: 'Generative Adversarial Networks (GANs)',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '40',
  position: { x: 0, y: 0 },
  data: {
    title: 'Transformer Models',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '41',
  position: { x: 0, y: 0 },
  data: {
    title: 'Optimization Techniques',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'customNode'
},
{
  id: '42',
  position: { x: 0, y: 0 },
  data: {
    title: 'Adaptive Learning Rates',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '43',
  position: { x: 0, y: 0 },
  data: { title: 'Momentum', status: 'In Progress', duedate: '2024-01-01' },
  type: 'subConceptNode'
},
{
  id: '44',
  position: { x: 0, y: 0 },
  data: {
    title: 'Adam Optimizer',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '45',
  position: { x: 0, y: 0 },
  data: {
    title: 'Deployment and Optimization',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'customNode'
},
{
  id: '46',
  position: { x: 0, y: 0 },
  data: {
    title: 'Model Deployment',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '47',
  position: { x: 0, y: 0 },
  data: {
    title: 'Model Optimization',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '48',
  position: { x: 0, y: 0 },
  data: {
    title: 'Quantization',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '49',
  position: { x: 0, y: 0 },
  data: { title: 'Pruning', status: 'In Progress', duedate: '2024-01-01' },
  type: 'subConceptNode'
},
{
  id: '50',
  position: { x: 0, y: 0 },
  data: {
    title: 'Model Compression',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '51',
  position: { x: 0, y: 0 },
  data: {
    title: 'Ethical Considerations',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'customNode'
},
{
  id: '52',
  position: { x: 0, y: 0 },
  data: {
    title: 'Bias and Fairness',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '53',
  position: { x: 0, y: 0 },
  data: {
    title: 'Privacy Concerns',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
},
{
  id: '54',
  position: { x: 0, y: 0 },
  data: {
    title: 'Transparency and Accountability',
    status: 'In Progress',
    duedate: '2024-01-01'
  },
  type: 'subConceptNode'
}]

const initialEdges = [
  {
    id: 'e0-1',
    source: '1',
    target: '0',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
    
  },
  {
    id: 'e1-2',
    source: '2',
    target: '1',
    animated: true,
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e1-3',
    source: '3',
    target: '1',
    animated: true,
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e1-4',
    source: '4',
    target: '1',
    animated: true,
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e0-5',
    source: '5',
    target: '0',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e5-6',
    source: '6',
    target: '5',
    animated: true,
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e5-7',
    source: '7',
    target: '5',
    animated: true,
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e7-8',
    source: '8',
    target: '7',
    animated: true,
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e7-9',
    source: '9',
    target: '7',
    animated: true,
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e7-10',
    source: '10',
    target: '7',
    animated: true,
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e7-11',
    source: '11',
    target: '7',
    animated: true,
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e0-12',
    source: '12',
    target: '0',
    animated: true,
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e12-13',
    source: '13',
    target: '12',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e12-14',
    source: '14',
    target: '12',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e12-15',
    source: '15',
    target: '12',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e15-16',
    source: '16',
    target: '15',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e15-17',
    source: '17',
    target: '15',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e0-18',
    source: '18',
    target: '0',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e18-19',
    source: '19',
    target: '18',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e18-20',
    source: '20',
    target: '18',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e18-21',
    source: '21',
    target: '18',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e0-22',
    source: '22',
    target: '0',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e22-23',
    source: '23',
    target: '22',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e22-24',
    source: '24',
    target: '22',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e22-25',
    source: '25',
    target: '22',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e25-26',
    source: '26',
    target: '25',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e25-27',
    source: '27',
    target: '25',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e22-28',
    source: '28',
    target: '22',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e0-29',
    source: '29',
    target: '0',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e29-30',
    source: '30',
    target: '29',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e29-31',
    source: '31',
    target: '29',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e29-32',
    source: '32',
    target: '29',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e0-33',
    source: '33',
    target: '0',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e33-34',
    source: '34',
    target: '33',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e33-35',
    source: '35',
    target: '33',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e33-36',
    source: '36',
    target: '33',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e0-37',
    source: '37',
    target: '0',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e37-38',
    source: '38',
    target: '37',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e37-39',
    source: '39',
    target: '37',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e37-40',
    source: '40',
    target: '37',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e0-41',
    source: '41',
    target: '0',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e41-42',
    source: '42',
    target: '41',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e41-43',
    source: '43',
    target: '41',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e41-44',
    source: '44',
    target: '41',
    style: { strokeWidth: 7, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e0-45',
    source: '45',
    target: '0',
    style: { strokeWidth: 20, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e45-46',
    source: '46',
    target: '45',
    style: { strokeWidth: 20, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e45-47',
    source: '47',
    target: '45',
    style: { strokeWidth: 20, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e47-48',
    source: '48',
    target: '47',
    style: { strokeWidth: 20, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e47-49',
    source: '49',
    target: '47',
    style: { strokeWidth: 20, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e47-50',
    source: '50',
    target: '47',
    style: { strokeWidth: 20, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e0-51',
    source: '51',
    target: '0',
    style: { strokeWidth: 20, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e51-52',
    source: '52',
    target: '51',
    style: { strokeWidth: 20, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e51-53',
    source: '53',
    target: '51',
    style: { strokeWidth: 20, stroke: 'white', zIndex: 9999999999 }
  },
  {
    id: 'e51-54',
    source: '54',
    target: '51',
    style: { strokeWidth: 20, stroke: 'white', zIndex: 9999999999 }
  }
]

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const getLayoutedElements = (
  nodes: { id: string; position: { x: number; y: number }; data: any; type?: string }[],
  edges: { source: string; target: string }[],
) => {
  g.setGraph({ rankdir: "BT", nodesep: 400, ranksep: 600 });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) => {
    if (node.type === 'noteNode') {
      g.setNode(node.id, { width: 1000, height: 8000, ranksep: 800, nodesep: 4000 });
    } else if (node.type === 'customNode') {
      g.setNode(node.id, { width: 2700, height: 800 });
    } else if (node.type === 'subConceptNode') {
      g.setNode(node.id, { width: 1000, height: 900 });
    } else {
      g.setNode(node.id, { width: 1000, height: 900 });
    }
  });

  Dagre.layout(g);


  return {
    nodes: nodes.map((node) => {
      const { x, y } = g.node(node.id);
      return { ...node, position: { x, y } };
    }),
    edges: edges.map((edge, index) => ({
      ...edge,
      id: `e${edge.source}-${edge.target}-${index}`,
    })),
  };
};


const EditorPage = () => {
    
const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
const [nodeCount, setNodeCount] = useState(3);
const [animationIndex, setAnimationIndex] = useState(0);

useEffect(() => {
  const layouted = getLayoutedElements(nodes, edges);
  setNodes(layouted.nodes);
  setEdges(layouted.edges);
}, [initialNodes, initialEdges]);

useEffect(() => {
  const interval = setInterval(() => {
    if (animationIndex < nodes.length) {
      setNodes((currentNodes) =>
        currentNodes.map((node, index) => ({
          ...node,
          hidden: index > animationIndex ? true : false,
        }))
      );
      setAnimationIndex(animationIndex + 1);
    } else {
      clearInterval(interval);
    }
  }, 50); // Adjust time as needed for animation speed

  return () => clearInterval(interval);
}, [animationIndex, nodes.length]);

const reactFlowWrapper = useRef(null);
const [reactFlowInstance, setReactFlowInstance] = useState(null);

useEffect(() => {
  if (reactFlowInstance) {
    reactFlowInstance.fitView();
  }
}, [reactFlowInstance]);

function addNoteNode() {
    const lastNode = nodes[nodes.length - 1];
    const newNode = {
        id: nodeCount.toString(),
        position: { x: lastNode.position.x + 300, y: lastNode.position.y },
        data: { title: 'New Note', status: "In Progress", duedate: "2024-01-01" },
        type: 'noteNode',
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeCount(nodeCount + 1);
}

function addNode(){
    if (nodes.length === 0) {
        const newNode = {
            id: "1",
            position: { x: x1 - 100, y: y1 + 100 },
            data: { title: 'New Note', status: "In Progress", duedate: "2024-01-01" },
            type: 'customNode',
        };
        setNodes([newNode]);
        return;
    }
    const lastNode = nodes[nodes.length - 1];
    const newNode = {
        id: nodeCount.toString(),
        position: { x: lastNode.position.x + 1300, y: lastNode.position.y },
        data: { title: 'New Note', status: "In Progress", duedate: "2024-01-01" },
        type: 'customNode'
    };
    setNodes((nds) => nds.concat(newNode));
    setNodeCount(nodeCount + 1);
}

function addSubConceptNode(){
  if (nodes.length === 0) {
    const newNode = {
        id: "1",
        position: { x: x1 - 100, y: y1 + 100 },
        data: { title: 'Building a Simple Neural Network', status: "In Progress", duedate: "2024-01-01" },
        type: 'subConceptNode',
    };
    setNodes([newNode]);
    return;
}
const lastNode = nodes[nodes.length - 1];
const newNode = {
    id: nodeCount.toString(),
    position: { x: lastNode.position.x + 500, y: lastNode.position.y },
    data: { title: 'Building a Simple Neural Network', status: "In Progress", duedate: "2024-01-01" },
    type: 'subConceptNode'
};
setNodes((nds) => nds.concat(newNode));
setNodeCount(nodeCount + 1);
}

const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge({
    ...params, 
    markerStart: {type: MarkerType.Arrow, width: 20, height: 10, color: 'white'},
    style: {strokeWidth: 7, stroke: 'white', zIndex:9999999999}
}, eds)), [setEdges]);

const handleNodeMouseEnter = (node:any) => {
    setNodes((els:any) =>
      els.map((el:any) => {
        if (el.id === node.id) {
          el.data = {
            ...el.data,
            isHovered: true,
          };
        }
        return el;
      })
    );
  };
  
  const handleNodeMouseLeave = (node:any) => {
    setNodes((els:any) =>
      els.map((el:any) => {
        if (el.id === node.id) {
          el.data = {
            ...el.data,
            isHovered: false,
          };
        }
        return el;
      })
    );
  };

  const handleNodeClick = (event:any, node:any) => {
    const zoomLevel = reactFlowInstance?.getZoom();
    if (zoomLevel < 0.2 && (node.type === "customNode" || node.type === "subConceptNode")) {
      const x = node.position.x + 1600;
      const y = node.position.y + 300;
      const zoom = 0.18;
      reactFlowInstance?.setCenter(x, y, { zoom, duration: 1000 });
    } else if (zoomLevel < 0.2 && node.type === "noteNode") {
      const x = node.position.x + 5500;
      const y = node.position.y + 2000;
      const zoom = 0.08;
      reactFlowInstance?.setCenter(x, y, { zoom, duration: 1000 });
    }
  };

const [isOpen, setIsOpen] = useState(false);
const toggleSidebar = () => {
    setIsOpen(!isOpen);
};


  
return (
    <>
    <div className="fixed top-0 left-0 h-full z-[99999]"><Navbar1 isOpen={isOpen} setIsOpen={toggleSidebar}/></div>
    <div className={`fixed ${isOpen ? 'right-[40%]' : 'right-[45%]'} transition-all duration-100 ease-in-out top-3 z-[99999] text-white shadow-lg`}><FlowTitle Sidebar={isOpen} /></div>
        <ReactFlowProvider>
            <div ref={reactFlowWrapper} className="w-[100vw] h-[100vh] bg-neutral-950">
                <Background variant={"dots" as any} gap={20} size={1}></Background>
                <ReactFlow
                    onNodeMouseEnter={(event, node) => handleNodeMouseEnter(node)}
                    onNodeMouseLeave={(event, node) => handleNodeMouseLeave(node)}
                    onNodeClick={handleNodeClick}
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    proOptions={proOptions}
                    nodeTypes={nodeTypes}
                    maxZoom={0.35}
                    minZoom={0.009}
                    defaultViewport={defaultViewport}
                    onInit={setReactFlowInstance}
                    
                ></ReactFlow>
            </div>
        </ReactFlowProvider>
        
    </>
    );
};

export default EditorPage;






