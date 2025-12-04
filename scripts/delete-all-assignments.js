const API_BASE_URL = 'http://localhost:3000';

async function deleteAllAssignments() {
  try {
    console.log('Fetching all assignments...\n');
    
    const response = await fetch(`${API_BASE_URL}/api/assignments`);
    const data = await response.json();
    
    if (!data.success || !data.assignments) {
      console.log('No assignments found or error fetching assignments.');
      return;
    }

    const assignments = data.assignments;
    console.log(`Found ${assignments.length} assignments. Starting deletion...\n`);

    for (let i = 0; i < assignments.length; i++) {
      const assignment = assignments[i];
      console.log(`Deleting ${i + 1}/${assignments.length}: ${assignment.title}...`);
      
      const deleteResponse = await fetch(`${API_BASE_URL}/api/assignments?id=${assignment._id}`, {
        method: 'DELETE',
      });

      if (deleteResponse.ok) {
        console.log(`✓ Deleted: ${assignment.title}`);
      } else {
        console.error(`✗ Failed to delete: ${assignment.title}`);
      }
    }

    console.log('\n✅ All assignments have been deleted!');
  } catch (error) {
    console.error('Error deleting assignments:', error.message);
  }
}

deleteAllAssignments();
