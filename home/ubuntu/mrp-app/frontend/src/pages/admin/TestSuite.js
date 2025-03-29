import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress, Alert, Grid, Card, CardContent, CardHeader, Divider } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const TestSuite = () => {
  const { currentDivision } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);
  const [overallStatus, setOverallStatus] = useState('');
  const [error, setError] = useState('');

  const runTests = async () => {
    setIsLoading(true);
    setError('');
    setTestResults([]);
    setOverallStatus('');

    try {
      // Test Authentication
      await testAuthentication();
      
      // Test Division Access
      await testDivisionAccess();
      
      // Test Item Management
      await testItemManagement();
      
      // Test BOM Management
      await testBomManagement();
      
      // Test Manufacturing Orders
      await testManufacturingOrders();
      
      // Test Inter-Division Transfers
      await testInterDivisionTransfers();
      
      // Test Costing
      await testCosting();
      
      // Calculate overall status
      const failedTests = testResults.filter(test => test.status === 'failed');
      if (failedTests.length === 0) {
        setOverallStatus('passed');
      } else {
        setOverallStatus('failed');
      }
    } catch (error) {
      console.error('Error running tests:', error);
      setError('An error occurred while running tests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addTestResult = (module, test, status, message) => {
    setTestResults(prev => [...prev, {
      id: `${module}-${test}-${Date.now()}`,
      module,
      test,
      status,
      message,
      timestamp: new Date().toISOString()
    }]);
  };

  const testAuthentication = async () => {
    try {
      // Test login
      const loginResponse = await api.auth.login({
        email: 'test@example.com',
        password: 'password123'
      });
      
      if (loginResponse.data && loginResponse.data.token) {
        addTestResult('Authentication', 'Login', 'passed', 'Successfully logged in with test credentials');
      } else {
        addTestResult('Authentication', 'Login', 'failed', 'Failed to login with test credentials');
      }
      
      // Test user profile
      const profileResponse = await api.user.getCurrentUser();
      if (profileResponse.data) {
        addTestResult('Authentication', 'Get User Profile', 'passed', 'Successfully retrieved user profile');
      } else {
        addTestResult('Authentication', 'Get User Profile', 'failed', 'Failed to retrieve user profile');
      }
    } catch (error) {
      addTestResult('Authentication', 'Authentication Tests', 'failed', `Error: ${error.message}`);
    }
  };

  const testDivisionAccess = async () => {
    try {
      // Test get all divisions
      const divisionsResponse = await api.division.getAllDivisions();
      if (divisionsResponse.data && Array.isArray(divisionsResponse.data)) {
        addTestResult('Division Access', 'Get All Divisions', 'passed', `Successfully retrieved ${divisionsResponse.data.length} divisions`);
      } else {
        addTestResult('Division Access', 'Get All Divisions', 'failed', 'Failed to retrieve divisions');
      }
      
      // Test division selection
      if (currentDivision) {
        addTestResult('Division Access', 'Current Division', 'passed', `Current division is set to: ${currentDivision.name}`);
      } else {
        addTestResult('Division Access', 'Current Division', 'failed', 'No current division is selected');
      }
    } catch (error) {
      addTestResult('Division Access', 'Division Tests', 'failed', `Error: ${error.message}`);
    }
  };

  const testItemManagement = async () => {
    try {
      // Test get all items
      const itemsResponse = await api.item.getAllItems({ divisionId: currentDivision?.id });
      if (itemsResponse.data && Array.isArray(itemsResponse.data)) {
        addTestResult('Item Management', 'Get All Items', 'passed', `Successfully retrieved ${itemsResponse.data.length} items`);
      } else {
        addTestResult('Item Management', 'Get All Items', 'failed', 'Failed to retrieve items');
      }
      
      // Test create item
      const newItem = {
        name: `Test Item ${Date.now()}`,
        description: 'Test item created by test suite',
        itemType: 'raw_material',
        unitOfMeasurement: 'pcs',
        divisionId: currentDivision?.id
      };
      
      const createItemResponse = await api.item.createItem(newItem);
      if (createItemResponse.data && createItemResponse.data.id) {
        addTestResult('Item Management', 'Create Item', 'passed', `Successfully created item with ID: ${createItemResponse.data.id}`);
        
        // Test get item by ID
        const getItemResponse = await api.item.getItemById(createItemResponse.data.id);
        if (getItemResponse.data && getItemResponse.data.id === createItemResponse.data.id) {
          addTestResult('Item Management', 'Get Item By ID', 'passed', 'Successfully retrieved item by ID');
        } else {
          addTestResult('Item Management', 'Get Item By ID', 'failed', 'Failed to retrieve item by ID');
        }
        
        // Test update item
        const updateItemResponse = await api.item.updateItem(createItemResponse.data.id, {
          ...getItemResponse.data,
          description: 'Updated description by test suite'
        });
        
        if (updateItemResponse.data) {
          addTestResult('Item Management', 'Update Item', 'passed', 'Successfully updated item');
        } else {
          addTestResult('Item Management', 'Update Item', 'failed', 'Failed to update item');
        }
        
        // Test delete item
        const deleteItemResponse = await api.item.deleteItem(createItemResponse.data.id);
        if (deleteItemResponse.data) {
          addTestResult('Item Management', 'Delete Item', 'passed', 'Successfully deleted item');
        } else {
          addTestResult('Item Management', 'Delete Item', 'failed', 'Failed to delete item');
        }
      } else {
        addTestResult('Item Management', 'Create Item', 'failed', 'Failed to create test item');
      }
    } catch (error) {
      addTestResult('Item Management', 'Item Tests', 'failed', `Error: ${error.message}`);
    }
  };

  const testBomManagement = async () => {
    try {
      // Test get all BOMs
      const bomsResponse = await api.bom.getAllBoms({ divisionId: currentDivision?.id });
      if (bomsResponse.data && Array.isArray(bomsResponse.data)) {
        addTestResult('BOM Management', 'Get All BOMs', 'passed', `Successfully retrieved ${bomsResponse.data.length} BOMs`);
      } else {
        addTestResult('BOM Management', 'Get All BOMs', 'failed', 'Failed to retrieve BOMs');
      }
      
      // Create test items for BOM
      const itemsResponse = await api.item.getAllItems({ divisionId: currentDivision?.id });
      if (!itemsResponse.data || !Array.isArray(itemsResponse.data) || itemsResponse.data.length < 2) {
        addTestResult('BOM Management', 'Create BOM', 'skipped', 'Not enough items available to create test BOM');
        return;
      }
      
      const parentItem = itemsResponse.data.find(item => item.itemType === 'finished_product' || item.itemType === 'semi_finished');
      const childItems = itemsResponse.data.filter(item => item.id !== parentItem?.id).slice(0, 2);
      
      if (!parentItem || childItems.length < 2) {
        addTestResult('BOM Management', 'Create BOM', 'skipped', 'Could not find suitable parent and child items for BOM test');
        return;
      }
      
      // Test create BOM
      const newBom = {
        name: `Test BOM ${Date.now()}`,
        description: 'Test BOM created by test suite',
        itemId: parentItem.id,
        divisionId: currentDivision?.id,
        version: '1.0',
        status: 'active',
        components: childItems.map((item, index) => ({
          childItemId: item.id,
          quantity: index + 1,
          unitOfMeasurement: item.unitOfMeasurement,
          level: 1
        }))
      };
      
      const createBomResponse = await api.bom.createBom(newBom);
      if (createBomResponse.data && createBomResponse.data.id) {
        addTestResult('BOM Management', 'Create BOM', 'passed', `Successfully created BOM with ID: ${createBomResponse.data.id}`);
        
        // Test get BOM by ID
        const getBomResponse = await api.bom.getBomById(createBomResponse.data.id);
        if (getBomResponse.data && getBomResponse.data.id === createBomResponse.data.id) {
          addTestResult('BOM Management', 'Get BOM By ID', 'passed', 'Successfully retrieved BOM by ID');
          
          // Verify multi-level BOM structure
          if (getBomResponse.data.components && getBomResponse.data.components.length === childItems.length) {
            addTestResult('BOM Management', 'Multi-level BOM Structure', 'passed', 'BOM has correct component structure');
          } else {
            addTestResult('BOM Management', 'Multi-level BOM Structure', 'failed', 'BOM does not have correct component structure');
          }
        } else {
          addTestResult('BOM Management', 'Get BOM By ID', 'failed', 'Failed to retrieve BOM by ID');
        }
        
        // Test update BOM
        const updateBomResponse = await api.bom.updateBom(createBomResponse.data.id, {
          ...getBomResponse.data,
          description: 'Updated description by test suite'
        });
        
        if (updateBomResponse.data) {
          addTestResult('BOM Management', 'Update BOM', 'passed', 'Successfully updated BOM');
        } else {
          addTestResult('BOM Management', 'Update BOM', 'failed', 'Failed to update BOM');
        }
      } else {
        addTestResult('BOM Management', 'Create BOM', 'failed', 'Failed to create test BOM');
      }
    } catch (error) {
      addTestResult('BOM Management', 'BOM Tests', 'failed', `Error: ${error.message}`);
    }
  };

  const testManufacturingOrders = async () => {
    try {
      // Test get all manufacturing orders
      const ordersResponse = await api.manufacturingOrder.getAllManufacturingOrders({ divisionId: currentDivision?.id });
      if (ordersResponse.data && Array.isArray(ordersResponse.data)) {
        addTestResult('Manufacturing Orders', 'Get All Orders', 'passed', `Successfully retrieved ${ordersResponse.data.length} manufacturing orders`);
      } else {
        addTestResult('Manufacturing Orders', 'Get All Orders', 'failed', 'Failed to retrieve manufacturing orders');
      }
      
      // Get BOMs for test
      const bomsResponse = await api.bom.getAllBoms({ divisionId: currentDivision?.id });
      if (!bomsResponse.data || !Array.isArray(bomsResponse.data) || bomsResponse.data.length === 0) {
        addTestResult('Manufacturing Orders', 'Create Order', 'skipped', 'No BOMs available to create test manufacturing order');
        return;
      }
      
      const testBom = bomsResponse.data[0];
      
      // Test create manufacturing order
      const newOrder = {
        orderNumber: `MO-${Date.now()}`,
        description: 'Test manufacturing order created by test suite',
        itemId: testBom.itemId,
        bomId: testBom.id,
        divisionId: currentDivision?.id,
        quantity: 10,
        unitOfMeasurement: 'pcs',
        plannedStartDate: new Date().toISOString().split('T')[0],
        plannedEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        priority: 'medium',
        status: 'planned',
        operations: [
          {
            operationType: 'laminating',
            sequence: 1,
            setupTime: 30,
            runTime: 60,
            status: 'pending'
          },
          {
            operationType: 'cutting',
            sequence: 2,
            setupTime: 15,
            runTime: 45,
            status: 'pending'
          },
          {
            operationType: 'sewing',
            sequence: 3,
            setupTime: 20,
            runTime: 90,
            status: 'pending'
          },
          {
            operationType: 'embroidery',
            sequence: 4,
            setupTime: 10,
            runTime: 30,
            status: 'pending'
          }
        ]
      };
      
      const createOrderResponse = await api.manufacturingOrder.createManufacturingOrder(newOrder);
      if (createOrderResponse.data && createOrderResponse.data.id) {
        addTestResult('Manufacturing Orders', 'Create Order', 'passed', `Successfully created manufacturing order with ID: ${createOrderResponse.data.id}`);
        
        // Test get order by ID
        const getOrderResponse = await api.manufacturingOrder.getManufacturingOrderById(createOrderResponse.data.id);
        if (getOrderResponse.data && getOrderResponse.data.id === createOrderResponse.data.id) {
          addTestResult('Manufacturing Orders', 'Get Order By ID', 'passed', 'Successfully retrieved manufacturing order by ID');
          
          // Verify specialized operations
          if (getOrderResponse.data.operations && getOrderResponse.data.operations.length === 4) {
            const operationTypes = getOrderResponse.data.operations.map(op => op.operationType);
            if (
              operationTypes.includes('laminating') &&
              operationTypes.includes('cutting') &&
              operationTypes.includes('sewing') &&
              operationTypes.includes('embroidery')
            ) {
              addTestResult('Manufacturing Orders', 'Specialized Operations', 'passed', 'Manufacturing order has all specialized operations');
            } else {
              addTestResult('Manufacturing Orders', 'Specialized Operations', 'failed', 'Manufacturing order does not have all specialized operations');
            }
          } else {
            addTestResult('Manufacturing Orders', 'Specialized Operations', 'failed', 'Manufacturing order does not have correct operations structure');
          }
        } else {
          addTestResult('Manufacturing Orders', 'Get Order By ID', 'failed', 'Failed to retrieve manufacturing order by ID');
        }
        
        // Test update order
        const updateOrderResponse = await api.manufacturingOrder.updateManufacturingOrder(createOrderResponse.data.id, {
          ...getOrderResponse.data,
          description: 'Updated description by test suite'
        });
        
        if (updateOrderResponse.data) {
          addTestResult('Manufacturing Orders', 'Update Order', 'passed', 'Successfully updated manufacturing order');
        } else {
          addTestResult('Manufacturing Orders', 'Update Order', 'failed', 'Failed to update manufacturing order');
        }
      } else {
        addTestResult('Manufacturing Orders', 'Create Order', 'failed', 'Failed to create test manufacturing order');
      }
    } catch (error) {
      addTestResult('Manufacturing Orders', 'Manufacturing Order Tests', 'failed', `Error: ${error.message}`);
    }
  };

  const testInterDivisionTransfers = async () => {
    try {
      // Test get all transfers
      const transfersResponse = await api.transfer.getAllTransfers({ divisionId: currentDivision?.id });
      if (transfersResponse.data && Array.isArray(transfersResponse.data)) {
        addTestResult('Inter-Division Transfers', 'Get All Transfers', 'passed', `Successfully retrieved ${transfersResponse.data.length} transfers`);
      } else {
        addTestResult('Inter-Division Transfers', 'Get All Transfers', 'failed', 'Failed to retrieve transfers');
      }
      
      // Get divisions for test
      const divisionsResponse = await api.division.getAllDivisions();
      if (!divisionsResponse.data || !Array.isArray(divisionsResponse.data) || divisionsRespons<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>