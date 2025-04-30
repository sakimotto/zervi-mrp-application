import axios from 'axios';

// Define API base URL - ideally from environment variable
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api/v1';

/**
 * Batch Management Service
 * 
 * Provides methods to interact with the backend API for batch/lot tracking
 * and fabric roll management operations.
 */
class BatchService {
  /**
   * Get all batches/lots with optional filtering
   * @param {Object} filters - Optional filters (itemId, status, etc.)
   * @returns {Promise<Array>} - Array of batch objects
   */
  async getBatches(filters = {}) {
    try {
      const response = await axios.get(`${API_URL}/inventory/lots`, { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching batches:', error);
      throw error;
    }
  }

  /**
   * Get a specific batch/lot by ID
   * @param {number} id - Batch ID
   * @returns {Promise<Object>} - Batch object
   */
  async getBatchById(id) {
    try {
      const response = await axios.get(`${API_URL}/inventory/lots/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching batch ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all batches for a specific item
   * @param {number} itemId - Item ID
   * @returns {Promise<Array>} - Array of batch objects
   */
  async getBatchesByItem(itemId) {
    try {
      const response = await axios.get(`${API_URL}/inventory/items/${itemId}/lots`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching batches for item ${itemId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new batch/lot
   * @param {Object} batchData - Batch data
   * @returns {Promise<Object>} - Created batch object
   */
  async createBatch(batchData) {
    try {
      const response = await axios.post(`${API_URL}/inventory/lots`, batchData);
      return response.data;
    } catch (error) {
      console.error('Error creating batch:', error);
      throw error;
    }
  }

  /**
   * Update an existing batch/lot
   * @param {number} id - Batch ID
   * @param {Object} batchData - Updated batch data
   * @returns {Promise<Object>} - Updated batch object
   */
  async updateBatch(id, batchData) {
    try {
      const response = await axios.put(`${API_URL}/inventory/lots/${id}`, batchData);
      return response.data;
    } catch (error) {
      console.error(`Error updating batch ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a batch/lot
   * @param {number} id - Batch ID
   * @returns {Promise<void>}
   */
  async deleteBatch(id) {
    try {
      await axios.delete(`${API_URL}/inventory/lots/${id}`);
    } catch (error) {
      console.error(`Error deleting batch ${id}:`, error);
      throw error;
    }
  }

  /**
   * Split a batch/lot into two separate batches
   * @param {number} id - Original batch ID
   * @param {number} splitQuantity - Quantity to split off
   * @param {string} newLotNumber - Optional new lot number
   * @returns {Promise<Object>} - Object with original and split batch
   */
  async splitBatch(id, splitQuantity, newLotNumber = null) {
    try {
      const response = await axios.post(`${API_URL}/inventory/lots/${id}/split`, {
        splitQuantity,
        newLotNumber
      });
      return response.data;
    } catch (error) {
      console.error(`Error splitting batch ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all fabric rolls for a batch/lot
   * @param {number} lotId - Batch/lot ID
   * @returns {Promise<Array>} - Array of fabric roll objects
   */
  async getFabricRollsByLot(lotId) {
    try {
      const response = await axios.get(`${API_URL}/inventory/lots/${lotId}/fabric-rolls`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching fabric rolls for batch ${lotId}:`, error);
      throw error;
    }
  }

  /**
   * Get a specific fabric roll by ID
   * @param {number} id - Fabric roll ID
   * @returns {Promise<Object>} - Fabric roll object
   */
  async getFabricRollById(id) {
    try {
      const response = await axios.get(`${API_URL}/inventory/fabric-rolls/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching fabric roll ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new fabric roll
   * @param {Object} rollData - Fabric roll data
   * @param {boolean} generateSerial - Whether to generate a serial number
   * @returns {Promise<Object>} - Created fabric roll object
   */
  async createFabricRoll(rollData, generateSerial = true) {
    try {
      const postData = { ...rollData, generateSerial };
      const response = await axios.post(`${API_URL}/inventory/fabric-rolls`, postData);
      return response.data;
    } catch (error) {
      console.error('Error creating fabric roll:', error);
      throw error;
    }
  }

  /**
   * Update an existing fabric roll
   * @param {number} id - Fabric roll ID
   * @param {Object} rollData - Updated roll data
   * @returns {Promise<Object>} - Updated fabric roll object
   */
  async updateFabricRoll(id, rollData) {
    try {
      const response = await axios.put(`${API_URL}/inventory/fabric-rolls/${id}`, rollData);
      return response.data;
    } catch (error) {
      console.error(`Error updating fabric roll ${id}:`, error);
      throw error;
    }
  }

  /**
   * Split a fabric roll into two separate rolls
   * @param {number} id - Original roll ID
   * @param {number} splitQuantity - Quantity to split off
   * @returns {Promise<Object>} - Object with original and split roll
   */
  async splitFabricRoll(id, splitQuantity) {
    try {
      const response = await axios.post(`${API_URL}/inventory/fabric-rolls/${id}/split`, {
        splitQuantity
      });
      return response.data;
    } catch (error) {
      console.error(`Error splitting fabric roll ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a fabric roll
   * @param {number} id - Fabric roll ID
   * @returns {Promise<void>}
   */
  async deleteFabricRoll(id) {
    try {
      await axios.delete(`${API_URL}/inventory/fabric-rolls/${id}`);
    } catch (error) {
      console.error(`Error deleting fabric roll ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get child rolls created from splits of a parent roll
   * @param {number} parentId - Parent roll ID
   * @returns {Promise<Array>} - Array of child roll objects
   */
  async getChildRolls(parentId) {
    try {
      const response = await axios.get(`${API_URL}/inventory/fabric-rolls/${parentId}/children`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching child rolls for roll ${parentId}:`, error);
      throw error;
    }
  }
}

// Create and export a singleton instance
export default new BatchService();
