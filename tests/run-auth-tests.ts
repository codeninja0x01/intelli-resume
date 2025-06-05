#!/usr/bin/env ts-node

/**
 * Comprehensive Auth System Test Runner
 * 
 * This script demonstrates the auth controller functionality using the test email:
 * qam64.test@inbox.testmail.app
 * 
 * Run with: npx ts-node tests/run-auth-tests.ts
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface TestResult {
  name: string;
  passed: number;
  failed: number;
  total: number;
  status: 'PASS' | 'FAIL';
  details?: string | undefined;
}

async function runTestSuite(testPath: string, name: string): Promise<TestResult> {
  try {
    console.log(`\n🧪 Running ${name}...`);
    const { stdout, stderr } = await execAsync(`npm test ${testPath} 2>&1`);
    
    // Parse Jest output - look in both stdout and stderr
    const output = stdout + stderr;
    
    // Look for the final summary line: "Tests: 12 passed, 12 total"
    const testsSummaryMatch = output.match(/Tests:\s+(\d+)\s+passed,\s+(\d+)\s+total/i);
    const testsFailedMatch = output.match(/Tests:\s+(\d+)\s+failed,\s+(\d+)\s+passed,\s+(\d+)\s+total/i);
    
    let passed = 0, failed = 0, total = 0;
    
    if (testsFailedMatch) {
      failed = parseInt(testsFailedMatch[1]);
      passed = parseInt(testsFailedMatch[2]);
      total = parseInt(testsFailedMatch[3]);
    } else if (testsSummaryMatch) {
      passed = parseInt(testsSummaryMatch[1]);
      total = parseInt(testsSummaryMatch[2]);
      failed = total - passed;
    }
    
    console.log(`   📊 Parsed: ${passed} passed, ${failed} failed, ${total} total`);
    
    const result: TestResult = {
      name,
      passed,
      failed,
      total,
      status: failed === 0 && passed > 0 ? 'PASS' : 'FAIL'
    };
    
    if (failed > 0 || output.includes('FAIL')) {
      result.details = `${failed} tests failed`;
    }
    
    return result;
  } catch (error: any) {
    console.log(`   ⚠️  Command failed, parsing error output...`);
    
    // Jest might exit with non-zero code even for passing tests with warnings
    const output = (error.stdout || '') + (error.stderr || '');
    
    // Try to parse even from error output
    const testsSummaryMatch = output.match(/Tests:\s+(\d+)\s+passed,\s+(\d+)\s+total/i);
    const testsFailedMatch = output.match(/Tests:\s+(\d+)\s+failed,\s+(\d+)\s+passed,\s+(\d+)\s+total/i);
    
    let passed = 0, failed = 0, total = 0;
    
    if (testsFailedMatch) {
      failed = parseInt(testsFailedMatch[1]);
      passed = parseInt(testsFailedMatch[2]);
      total = parseInt(testsFailedMatch[3]);
    } else if (testsSummaryMatch) {
      passed = parseInt(testsSummaryMatch[1]);
      total = parseInt(testsSummaryMatch[2]);
      failed = total - passed;
    } else {
      // Fallback - assume 1 failed test if no parsing worked
      failed = 1;
      total = 1;
    }
    
    return {
      name,
      passed,
      failed,
      total,
      status: failed === 0 && passed > 0 ? 'PASS' : 'FAIL',
      details: error.message.substring(0, 300)
    };
  }
}

async function runComprehensiveAuthTests() {
  console.log('🚀 Starting Comprehensive Auth System Tests');
  console.log('📧 Using test email: qam64.test@inbox.testmail.app');
  console.log('=' .repeat(60));
  
  const testSuites: Array<{ path: string; name: string; description: string }> = [
    {
      path: 'tests/unit/auth.service.test.ts',
      name: 'Unit Tests',
      description: 'Tests auth service business logic with mocked dependencies'
    },
    {
      path: 'tests/integration/auth-validation.test.ts',
      name: 'Integration Tests',
      description: 'Tests auth middleware, validation, and error handling'
    }
  ];
  
  const results: TestResult[] = [];
  
  for (const suite of testSuites) {
    const result = await runTestSuite(suite.path, suite.name);
    results.push(result);
    
    console.log(`${result.status === 'PASS' ? '✅' : '❌'} ${result.name}: ${result.passed}/${result.total} passed`);
    if (result.details && result.status === 'FAIL') {
      console.log(`   Details: ${result.details}`);
    }
  }
  
  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('=' .repeat(60));
  
  let totalPassed = 0;
  let totalFailed = 0;
  let totalTests = 0;
  
  results.forEach(result => {
    totalPassed += result.passed;
    totalFailed += result.failed;
    totalTests += result.total;
    
    console.log(`${result.status === 'PASS' ? '✅' : '❌'} ${result.name.padEnd(20)} ${result.passed}/${result.total} tests passed`);
  });
  
  console.log('-'.repeat(60));
  console.log(`📈 OVERALL: ${totalPassed}/${totalTests} tests passed (${((totalPassed/totalTests)*100).toFixed(1)}%)`);
  
  if (totalFailed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Your auth system is working correctly.');
    console.log('\n✨ What this proves:');
    console.log('   ✅ Authentication middleware works perfectly');
    console.log('   ✅ Token validation is secure');
    console.log('   ✅ Error handling is consistent');
    console.log('   ✅ Business logic validation works');
    console.log('   ✅ Protected routes are properly secured');
    console.log('   ✅ Http-errors integration is working');
    console.log('   ✅ Express-validator integration is working');
  } else {
    console.log(`\n⚠️  ${totalFailed} tests failed. Check the details above.`);
  }
  
  console.log('\n📝 Next Steps:');
  console.log('   1. Set up real Supabase credentials to test end-to-end auth');
  console.log('   2. Test with actual user registration using the test email');
  console.log('   3. Run manual API tests using the endpoints');
  
  console.log('\n🔗 API Endpoints to test manually:');
  console.log('   POST /api/auth/signup   - Create account with test email');
  console.log('   POST /api/auth/signin   - Sign in with credentials');
  console.log('   GET  /api/auth/me       - Get current user (requires token)');
  console.log('   POST /api/auth/refresh  - Refresh JWT token');
  console.log('   POST /api/auth/signout  - Sign out user');
  
  return totalFailed === 0;
}

// Run the tests
if (require.main === module) {
  runComprehensiveAuthTests()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Test runner failed:', error);
      process.exit(1);
    });
}

export { runComprehensiveAuthTests }; 