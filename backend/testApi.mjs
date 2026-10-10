// testApi.mjs - Automated testing of all Task 5 endpoints
const BASE_URL = 'http://localhost:5000/api/tasks';

async function runTests() {
  console.log('🧪 Starting API Verification Tests...\n');

  try {
    // 1. Initial GET /api/tasks (should be empty array or existing tasks)
    console.log('Test 1: GET /api/tasks');
    const res1 = await fetch(BASE_URL);
    const data1 = await res1.json();
    console.log(`Status: ${res1.status}, Count: ${data1.count}, Success: ${data1.success}`);
    if (res1.status !== 200 || !data1.success) throw new Error('Test 1 failed');

    // 2. Validation failure: POST with missing title
    console.log('\nTest 2: POST /api/tasks (Validation failure test - missing title)');
    const resFail = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'No title provided' })
    });
    const dataFail = await resFail.json();
    console.log(`Status: ${resFail.status} (Expected 400), Message: "${dataFail.message}"`);
    if (resFail.status !== 400 || dataFail.success !== false) throw new Error('Test 2 failed');

    // 3. POST /api/tasks - Create Task 1
    console.log('\nTest 3: POST /api/tasks (Create valid task)');
    const resPost = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Complete Internship Task 5',
        description: 'Implement React Vite frontend and Express MongoDB backend',
        status: 'In Progress',
        priority: 'High'
      })
    });
    const dataPost = await resPost.json();
    console.log(`Status: ${resPost.status} (Expected 201), Task ID: ${dataPost.data._id}`);
    if (resPost.status !== 201 || !dataPost.data._id) throw new Error('Test 3 failed');
    const taskId = dataPost.data._id;

    // 4. GET /api/tasks/:id - Fetch single task
    console.log('\nTest 4: GET /api/tasks/:id (Fetch created task)');
    const resGetOne = await fetch(`${BASE_URL}/${taskId}`);
    const dataGetOne = await resGetOne.json();
    console.log(`Status: ${resGetOne.status}, Title: "${dataGetOne.data.title}", Status: "${dataGetOne.data.status}"`);
    if (resGetOne.status !== 200 || dataGetOne.data._id !== taskId) throw new Error('Test 4 failed');

    // 5. PUT /api/tasks/:id - Update task
    console.log('\nTest 5: PUT /api/tasks/:id (Update status to Completed)');
    const resPut = await fetch(`${BASE_URL}/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'Completed',
        description: 'Successfully verified backend CRUD endpoints and MongoDB persistence!'
      })
    });
    const dataPut = await resPut.json();
    console.log(`Status: ${resPut.status}, Updated Status: "${dataPut.data.status}", Description: "${dataPut.data.description}"`);
    if (resPut.status !== 200 || dataPut.data.status !== 'Completed') throw new Error('Test 5 failed');

    // 6. Test invalid ID handling (400 Bad Request)
    console.log('\nTest 6: GET /api/tasks/invalid-id-123 (Invalid ObjectId format)');
    const resBadId = await fetch(`${BASE_URL}/invalid-id-123`);
    const dataBadId = await resBadId.json();
    console.log(`Status: ${resBadId.status} (Expected 400), Message: "${dataBadId.message}"`);
    if (resBadId.status !== 400) throw new Error('Test 6 failed');

    // 7. Test non-existent valid ObjectId (404 Not Found)
    console.log('\nTest 7: GET /api/tasks/507f1f77bcf86cd799439011 (Non-existent task)');
    const res404 = await fetch(`${BASE_URL}/507f1f77bcf86cd799439011`);
    const data404 = await res404.json();
    console.log(`Status: ${res404.status} (Expected 404), Message: "${data404.message}"`);
    if (res404.status !== 404) throw new Error('Test 7 failed');

    // 8. DELETE /api/tasks/:id - Delete created task
    console.log('\nTest 8: DELETE /api/tasks/:id');
    const resDel = await fetch(`${BASE_URL}/${taskId}`, { method: 'DELETE' });
    const dataDel = await resDel.json();
    console.log(`Status: ${resDel.status} (Expected 200), Deleted ID: ${dataDel.data.id}`);
    if (resDel.status !== 200 || dataDel.data.id !== taskId) throw new Error('Test 8 failed');

    // 9. Verify task is gone
    console.log('\nTest 9: Verify task is deleted (Expect 404)');
    const resVerifyDel = await fetch(`${BASE_URL}/${taskId}`);
    console.log(`Status: ${resVerifyDel.status} (Expected 404)`);
    if (resVerifyDel.status !== 404) throw new Error('Test 9 failed');

    console.log('\n🎉 ALL 9 BACKEND ENDPOINT & ERROR TESTS PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ Test suite failed:', err);
    process.exit(1);
  }
}

runTests();
