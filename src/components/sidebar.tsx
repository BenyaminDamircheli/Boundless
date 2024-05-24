import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserButton, useUser, useAuth } from "@clerk/nextjs";
import { ReactFlow } from "@prisma/client";
import Item from "./space";
import ItemList from "./itemList";
import { SquareMenu } from "lucide-react";
import NewConcept from "./newConcept";
import { useHotkeys } from 'react-hotkeys-hook'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function Navbar1({isOpen, setIsOpen}: {isOpen: boolean, setIsOpen: (isOpen: boolean) => void}){
    const router = useRouter();
    const handleFlowClick = (id: number) => {
        router.push(`/editor/${id}`);
    }

    function onMouseDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>){
        e.preventDefault();
        e.stopPropagation();
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    useHotkeys('meta+k', () => 
    setIsModalOpen(true));

    const sidebarStyle = isOpen ? 'translate-x-0 duration-100' : '-translate-x-full duration-100'; // Move sidebar off-screen when closed
    const { user } = useUser();
    const { userId } = useAuth();

    return (
        <>
        {!isOpen && ( 
            <div
                role="button"
                className="h-6 w-6 text-muted-foreground rounded hover:bg-neutral-700 top-3 left-3 cursor-pointer fixed z-20 "
                onClick={() => setIsOpen(!isOpen)}
            >
                <SquareMenu className="h-6 w-6" />
            </div>)}
            <aside className={`bg-neutral-900 h-full w-60 overflow-hidden overflow-y-auto absolute top-0 transition-all duration-300 ease-in-out ${sidebarStyle}`}>
            
                <div className="flex mt-3 ml-4">
                    
                    <UserButton />
                    <p className="text-white ml-2 text-xs font-bold flex items-center">Welcome {user?.firstName}</p>
                    {isOpen && (
                        <div
                            role="button"
                            className="h-6 w-6 ml-6 t text-muted-foreground rounded hover:bg-neutral-700 cursor-pointer"
                            onClick={() => setIsOpen(false)}
                        >
                            <SquareMenu className="h-6 w-6" />
                        </div>
                    )}
                </div>
                <div className={`${isOpen ? 'block' : 'hidden'} mt-10 ml-4 mr-4`}>
                    <NewConcept isOpen={isModalOpen} setIsOpen={setIsModalOpen} />
                </div>

                <div className="">
                    <Tabs defaultValue="toc">
                        <TabsList className="flex-row w-full">
                            <TabsTrigger value="toc" className={`${isOpen ? 'block' : 'hidden'}`}><p className="text-white font-bold">Table of Contents</p></TabsTrigger>
                            <TabsTrigger value="history" className={`${isOpen ? 'block' : 'hidden'}`}><p className="text-white font-bold">History</p></TabsTrigger>
                        </TabsList>
                        <TabsContent value="toc" className={`mt-4 ml-4 text-sm font-bold bg-neutral-800 border-[1px] border-neutral-800 shadow-lg rounded ${isOpen ? 'block' : 'hidden'}`}>
                        <ol className="ml-4 pb-10 leading-6 list-decimal mr-4">
                        <li>Introduction to Neural Networks
                            <ul className="ml-4 border-l-2 border-neutral-700 pl-2">
                                <li>Definition and Basics</li>
                                <li>Historical Context</li>
                                <li>Applications</li>
                            </ul>
                        </li>
                        <li>Perceptrons and Activation Functions
                            <ul className="border-l-2 border-neutral-700 pl-2 my-2 mr-4">
                                <li>Perceptron Model</li>
                                <li>Activation Functions
                                    <ul className="border-l-2 border-neutral-700 pl-2 my-2 mr-4">
                                        <li>Sigmoid</li>
                                        <li>ReLU</li>
                                        <li>Tanh</li>
                                        <li>Softmax</li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li>Feedforward Neural Networks
                            <ul className="border-l-2 border-neutral-700 pl-2 my-2 mr-4">
                                <li>Architecture</li>
                                <li>Forward Propagation</li>
                                <li>Loss Functions
                                    <ul className="border-l-2 border-neutral-700 pl-2 my-2 mr-4">
                                        <li>Mean Squared Error</li>
                                        <li>Cross-Entropy</li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li>Backpropagation
                            <ul className="border-l-2 border-neutral-700 pl-2 my-2 mr-4">
                                <li>Gradient Descent</li>
                                <li>Chain Rule</li>
                                <li>Backpropagation Algorithm</li>
                            </ul>
                        </li>
                        <li>Training Neural Networks
                            <ul className="border-l-2 border-neutral-700 pl-2 my-2 mr-4">
                                <li>Data Preparation</li>
                                <li>Mini-Batch Gradient Descent</li>
                                <li>Regularization Techniques
                                    <ul className="border-l-2 border-neutral-700 pl-2 my-2 mr-4">
                                        <li>L1 and L2 Regularization</li>
                                        <li>Dropout</li>
                                    </ul>
                                </li>
                                <li>Hyperparameter Tuning</li>
                            </ul>
                        </li>
                        <li>Convolutional Neural Networks (CNNs)
                            <ul className="border-l-2 border-neutral-700 pl-2 my-2 mr-4">
                                <li>Convolutional Layers</li>
                                <li>Pooling Layers</li>
                                <li>Applications in Image Processing</li>
                            </ul>
                        </li>
                        <li>Recurrent Neural Networks (RNNs)
                            <ul className="border-l-2 border-neutral-700 pl-2 my-2 mr-4">
                                <li>Basic RNN Architecture</li>
                                <li>Long Short-Term Memory (LSTM)</li>
                                <li>Gated Recurrent Unit (GRU)</li>
                            </ul>
                        </li>
                        <li>Advanced Architectures
                            <ul className="border-l-2 border-neutral-700 pl-2 my-2 mr-4">
                                <li>Autoencoders</li>
                                <li>Generative Adversarial Networks (GANs)</li>
                                <li>Transformer Models</li>
                            </ul>
                        </li>
                        <li>Optimization Techniques
                            <ul className="border-l-2 border-neutral-700 pl-2 my-2 mr-4">
                                <li>Adaptive Learning Rates</li>
                                <li>Momentum</li>
                                <li>Adam Optimizer</li>
                            </ul>
                        </li>
                        <li>Deployment and Optimization
                            <ul className="border-l-2 border-neutral-700 pl-2 my-2 mr-4">
                                <li>Model Deployment</li>
                                <li>Model Optimization
                                    <ul className="border-l-2 border-neutral-700 pl-2 my-2 mr-4">
                                        <li>Quantization</li>
                                        <li>Pruning</li>
                                        <li>Model Compression</li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li>Ethical Considerations
                            <ul className="border-l-2 border-neutral-700 pl-2 my-2 mr-4">
                                <li>Bias and Fairness</li>
                                <li>Privacy Concerns</li>
                                <li>Transparency and Accountability</li>
                            </ul>
                        </li>
                    </ol>
                        </TabsContent>
                        <TabsContent value="history">
                            <div className={`mt-4 ml-4 ${isOpen ? 'block' : 'hidden'}`}>
                                <ItemList userId={userId} />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </aside>
        </>
    );
}

export default Navbar1;





