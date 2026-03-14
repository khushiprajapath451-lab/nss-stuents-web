const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { rollNumber, password } = await req.json();

    if (!rollNumber || !password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Roll number and password are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`ERP sync attempt for: ${rollNumber}`);

    // Step 1: Login to Vardhaman ERP
    const loginResponse = await fetch('https://login.vardhaman.org/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      body: `username=${encodeURIComponent(rollNumber)}&password=${encodeURIComponent(password)}`,
      redirect: 'manual',
    });

    // Collect cookies from login response
    const cookies: string[] = [];
    for (const [key, value] of loginResponse.headers.entries()) {
      if (key.toLowerCase() === 'set-cookie') {
        cookies.push(value.split(';')[0]);
      }
    }

    const cookieHeader = cookies.join('; ');

    if (!cookieHeader && loginResponse.status !== 302 && loginResponse.status !== 200) {
      return new Response(
        JSON.stringify({ success: false, error: 'ERP login failed. Check your credentials.' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Login response status: ${loginResponse.status}`);

    // Step 2: Fetch student dashboard
    const dashboardResponse = await fetch('https://student.vardhaman.org/', {
      headers: {
        'Cookie': cookieHeader,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    const html = await dashboardResponse.text();

    // Step 3: Parse student data from HTML
    const branchMatch = html.match(/Branch\s*:?\s*<[^>]*>\s*([^<]+)/i)
      || html.match(/Department\s*:?\s*<[^>]*>\s*([^<]+)/i)
      || html.match(/branch['"]\s*>\s*([^<]+)/i);

    const sectionMatch = html.match(/Section\s*:?\s*<[^>]*>\s*([^<]+)/i)
      || html.match(/section['"]\s*>\s*([^<]+)/i);

    const yearMatch = html.match(/Academic\s*Year\s*:?\s*<[^>]*>\s*([^<]+)/i)
      || html.match(/Batch\s*:?\s*<[^>]*>\s*([^<]+)/i)
      || html.match(/year['"]\s*>\s*([^<]+)/i);

    const attendanceMatch = html.match(/(\d+\.?\d*)\s*%/i);

    const nameMatch = html.match(/Student\s*Name\s*:?\s*<[^>]*>\s*([^<]+)/i)
      || html.match(/name['"]\s*>\s*([^<]+)/i);

    const semesterMatch = html.match(/Semester\s*:?\s*<[^>]*>\s*(\d+)/i)
      || html.match(/semester['"]\s*>\s*(\d+)/i);

    // Fallback: try to infer branch from roll number pattern if scraping didn't work
    let branch = branchMatch ? branchMatch[1].trim() : null;
    let section = sectionMatch ? sectionMatch[1].trim() : null;
    const academicYear = yearMatch ? yearMatch[1].trim() : null;
    const attendance = attendanceMatch ? parseFloat(attendanceMatch[1]) : null;
    const studentName = nameMatch ? nameMatch[1].trim() : null;
    const semester = semesterMatch ? parseInt(semesterMatch[1]) : null;

    // If we couldn't scrape branch/section, try from roll number as last resort
    if (!branch) {
      const rollUpper = rollNumber.toUpperCase();
      // Vardhaman roll pattern: YYBBBACDDEE where BBB = branch code
      const branchCodes: Record<string, string> = {
        '05': 'Information Technology',
        '01': 'Civil Engineering',
        '02': 'Electrical Engineering',
        '03': 'Mechanical Engineering',
        '04': 'Electronics & Communication',
        '12': 'Computer Science',
        '66': 'Artificial Intelligence & ML',
        '67': 'Data Science',
        'R5': 'Computer Science',
      };
      const codeMatch = rollUpper.match(/\d{4}[A-Z]\d{2}(\w{2})/);
      if (codeMatch) {
        branch = branchCodes[codeMatch[1]] || null;
      }
    }

    // Check if we got meaningful data
    const hasData = branch || section || attendance !== null;

    if (!hasData) {
      // Return partial success - login may have worked but scraping failed
      return new Response(
        JSON.stringify({
          success: true,
          partial: true,
          message: 'Connected to ERP but could not extract all profile data. The ERP page structure may have changed.',
          data: {
            rollNumber: rollNumber.toUpperCase(),
            branch: branch || 'Not available',
            section: section || 'Not available',
            academicYear: academicYear || 'Not available',
            attendance: attendance,
            studentName: studentName || null,
            semester: semester || null,
            syncedAt: new Date().toISOString(),
          },
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          rollNumber: rollNumber.toUpperCase(),
          branch: branch || 'Not available',
          section: section || 'Not available',
          academicYear: academicYear || 'Not available',
          attendance: attendance,
          studentName: studentName || null,
          semester: semester || null,
          syncedAt: new Date().toISOString(),
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('ERP sync error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to sync with ERP';
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
