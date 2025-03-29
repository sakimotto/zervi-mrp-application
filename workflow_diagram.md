# Manufacturing Workflow Diagram

```mermaid
graph TD
    %% Core entities
    Product[Product/Item] --> BOM[Bill of Materials]
    BOM --> Components[Components/Materials]
    Product --> Routing[Routing]
    
    %% Routing and operations
    Routing --> Operations[Operations]
    Operations --> |Types| OpTypes{Operation Types}
    OpTypes --> General[General]
    OpTypes --> Laminating[Laminating]
    OpTypes --> Cutting[Cutting]
    OpTypes --> Sewing[Sewing]
    OpTypes --> Embroidery[Embroidery]
    
    %% Manufacturing process
    SalesOrder[Sales Order] --> MRP[MRP Planning]
    MRP --> |Creates| ManufacturingOrder[Manufacturing Order]
    ManufacturingOrder --> |Requires| BOM
    ManufacturingOrder --> |Follows| Routing
    
    %% Resource allocation
    Operations --> |Assigned to| Workstations[Workstations]
    Workstations --> Resources[Resources/Machines]
    Operations --> |Performed by| Workers[Workers]
    
    %% Material flow
    Inventory[Inventory] --> |Issues| Components
    ManufacturingOrder --> |Consumes| Components
    ManufacturingOrder --> |Produces| FinishedGoods[Finished Goods]
    FinishedGoods --> |Updates| Inventory
    
    %% Production tracking
    ManufacturingOrder --> |Creates| WorkOrders[Work Orders]
    WorkOrders --> |Track| OperationProgress[Operation Progress]
    OperationProgress --> |Updates| ManufacturingOrder
    
    %% Quality control
    OperationProgress --> QualityCheck[Quality Check]
    QualityCheck --> |Pass/Fail| FinishedGoods
    
    %% Cost tracking
    Operations --> |Contributes to| OperationCosts[Operation Costs]
    Components --> |Contributes to| MaterialCosts[Material Costs]
    OperationCosts --> ProductCost[Product Cost]
    MaterialCosts --> ProductCost
    
    %% Legend
    classDef core fill:#f9f,stroke:#333,stroke-width:2px;
    classDef process fill:#bbf,stroke:#333,stroke-width:1px;
    classDef material fill:#bfb,stroke:#333,stroke-width:1px;
    classDef resource fill:#fbf,stroke:#333,stroke-width:1px;
    
    class Product,BOM,Components,Routing,Operations core;
    class SalesOrder,MRP,ManufacturingOrder,WorkOrders,OperationProgress process;
    class Inventory,FinishedGoods material;
    class Workstations,Workers,Resources resource;
```

## Simplified Manufacturing Workflow Explanation

1. **Product Definition**
   - Each product has a **Bill of Materials (BOM)** listing all required components
   - Each product has a **Routing** defining the sequence of operations needed to manufacture it

2. **Planning Process**
   - **Sales Orders** trigger demand
   - **MRP Planning** calculates material requirements and production needs
   - **Manufacturing Orders** are created to produce products

3. **Production Process**
   - **Manufacturing Orders** follow the routing defined for the product
   - Each **Operation** (General, Laminating, Cutting, Sewing, Embroidery) is performed at designated **Workstations**
   - **Components** are pulled from **Inventory** as needed
   - Operations are tracked through **Work Orders** and **Operation Progress** updates

4. **Resource Management**
   - **Workstations** represent production areas or machines
   - **Operations** are assigned to specific workstations
   - Workers perform operations according to their skills and availability

5. **Inventory Flow**
   - Raw materials and components are consumed
   - Finished goods are produced and added to inventory
   - Transfers between divisions may occur for vertically integrated processes

6. **Costing**
   - Material costs are tracked
   - Operation costs (labor, machine time) are recorded
   - Combined to calculate total product cost

This workflow represents a typical manufacturing process flow in an MRP system with special emphasis on Zervi's custom operations of Laminating, Cutting, Sewing, and Embroidery.
