
function parseTOC(toc: string, query: string) {
    const lines = toc.split('\n').filter(line => line.trim() !== '');
    const nodes: any[] = [];
    const edges: any[] = [];
    let nodeId = 0;
    const parentStack: { id: number, level: number }[] = [];

    // Add the very first node as a noteNode with the title being the query
    const firstNode = {
        id: nodeId.toString(),
        position: { x: 0, y: 0 },
        data: { title: query },
        type: 'noteNode'
    };
    nodes.push(firstNode);
    nodeId++;

    lines.forEach((line) => {
        const level = (line.match(/^\s*/)?.[0].length ?? 0) / 4; // Adjusted for 4 spaces per level
        const title = line.replace(/^\s*[-\d]+\.\s*/, '').replace(/^—/, '').replace(/^-/, '').replace(/^\s*-\s*/, '').trim();

        const node: any = {
            id: nodeId.toString(),
            position: { x: 0, y: 0 }, 
            data: { title: title, level: level, pageTopic: query},
            type: level === 0 ? 'customNode' : 'subConceptNode',
        };

        while (parentStack.length > 0 && parentStack[parentStack.length - 1].level >= level) {
            parentStack.pop();
        }

        if (level === 0) {
            // Connect all main concept nodes to the first noteNode
            edges.push({
                id: `e0-${nodeId}`,
                source: nodeId.toString(),
                target: '0',
                style: {
                    strokeWidth: 7, stroke: 'white', zIndex:9999999999, 
                    markerStart: 'arrow'
                }
            });
        } else if (parentStack.length > 0) {
            const parentNodeId = parentStack[parentStack.length - 1].id;
            node.data.parentNode = parentNodeId.toString();
            edges.push({
                id: `e${parentNodeId}-${nodeId}`,
                source: nodeId.toString(),
                target: parentNodeId.toString(),
                style: {
                    strokeWidth: 7, stroke: 'white', zIndex:9999999999
                }
            });
        }

        nodes.push(node);
        parentStack.push({ id: nodeId, level: level });
        nodeId++;
    });

    console.log(nodes);
    console.log(edges);
    
    return { nodes, edges };
}

parseTOC(`
1. Introduction to Neural Networks
   - Definition and Basics
   - Historical Context
   - Applications
   
2. Perceptrons and Activation Functions
   - Perceptron Model
   - Activation Functions
     - Sigmoid
     - ReLU
     - Tanh
     - Softmax

3. Feedforward Neural Networks
   - Architecture
   - Forward Propagation
   - Loss Functions
     - Mean Squared Error
     - Cross-Entropy

4. Backpropagation
   - Gradient Descent
   - Chain Rule
   - Backpropagation Algorithm

5. Training Neural Networks
   - Data Preparation
   - Mini-Batch Gradient Descent
   - Regularization Techniques
     - L1 and L2 Regularization
     - Dropout
   - Hyperparameter Tuning
   
6. Convolutional Neural Networks (CNNs)
   - Convolutional Layers
   - Pooling Layers
   - Applications in Image Processing

7. Recurrent Neural Networks (RNNs)
   - Basic RNN Architecture
   - Long Short-Term Memory (LSTM)
   - Gated Recurrent Unit (GRU)

8. Advanced Architectures
   - Autoencoders
   - Generative Adversarial Networks (GANs)
   - Transformer Models

9. Optimization Techniques
   - Adaptive Learning Rates
   - Momentum
   - Adam Optimizer

10. Deployment and Optimization
    - Model Deployment
    - Model Optimization
      - Quantization
      - Pruning
      - Model Compression

11. Ethical Considerations
    - Bias and Fairness
    - Privacy Concerns
    - Transparency and Accountability
`, "Transformers and Neural Networks");
