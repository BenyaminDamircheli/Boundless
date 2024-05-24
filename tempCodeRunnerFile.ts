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
        data: { title: query, status: 'In Progress', duedate: '2024-01-01' },
        type: 'noteNode'
    };
    nodes.push(firstNode);
    nodeId++;

    lines.forEach((line) => {
        const level = (line.match(/^\s*/)?.[0].length ?? 0) / 4; // Adjusted for 4 spaces per level
        const title = line.replace(/^\s*[-\d]+\.\s*/, '').replace(/^—/, '').replace(/^-/, '').replace(/^\s*-\s*/, '').trim();

        const node = {
            id: nodeId.toString(),
            position: { x: 0, y: 0 }, // Default position, can be adjusted as needed
            data: { title: title, status: 'In Progress', duedate: '2024-01-01' },
            type: level === 0 ? 'customNode' : 'subConceptNode',
            
        };
        nodes.push(node);

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
                    strokeWidth: 7, stroke: 'white', zIndex:9999999999
                }
            });
        } else if (parentStack.length > 0) {
            const parentNodeId = parentStack[parentStack.length - 1].id;
            edges.push({
                id: `e${parentNodeId}-${nodeId}`,
                source: nodeId.toString(),
                target: parentNodeId.toString(),
                style: {
                    strokeWidth: 7, stroke: 'white', zIndex:9999999999
                }
            });
        }

        parentStack.push({ id: nodeId, level: level });
        nodeId++;
    });

    console.log(nodes);
    console.log(edges);
    
    return { nodes, edges };
}
