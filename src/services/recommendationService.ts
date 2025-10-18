import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export interface StreamRecommendation {
  id: string;
  name: string;
  description: string;
  suitability: number;
  reasons: string[];
  subjects: string[];
  careerPaths: string[];
  icon: string;
}

export interface CollegeRecommendation {
  id: string;
  name: string;
  location: string;
  rating: number;
  cutoff: string;
  course: string;
  description: string;
  whyItFits: string;
  officialLink: string;
  image: string;
  tags: string[];
}

export interface RecommendationData {
  streamRecommendations: StreamRecommendation[];
  collegeRecommendations: CollegeRecommendation[];
  overallInsights: {
    strengths: string[];
    areasForImprovement: string[];
    personalityTraits: string[];
    learningStyle: string;
  };
}

export class RecommendationService {
  // Generate recommendations based on student data
  static async generateRecommendations(
    marksData: any, 
    aptitudeData: any[], 
    conversationData: any
  ): Promise<RecommendationData> {
    const logicalScore = aptitudeData.find(a => a.testType === 'logical')?.percentage || 0;
    const interestScore = aptitudeData.find(a => a.testType === 'interest')?.percentage || 0;
    const overallPercentage = marksData.overallPercentage || 0;
    const interestArea = marksData.interestArea || '';

    // Generate stream recommendations
    const streamRecommendations: StreamRecommendation[] = [
      {
        id: 'science',
        name: 'Science Stream',
        description: 'Focus on Physics, Chemistry, Mathematics, and Biology for STEM careers',
        suitability: this.calculateStreamSuitability('science', logicalScore, interestScore, overallPercentage, interestArea),
        reasons: this.generateStreamReasons('science', logicalScore, interestScore, overallPercentage, interestArea),
        subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology/Computer Science'],
        careerPaths: ['Engineering', 'Medicine', 'Research', 'Data Science', 'Biotechnology', 'Pharmacy'],
        icon: '🔬'
      },
      {
        id: 'commerce',
        name: 'Commerce Stream',
        description: 'Focus on Business Studies, Economics, Accountancy, and Mathematics',
        suitability: this.calculateStreamSuitability('commerce', logicalScore, interestScore, overallPercentage, interestArea),
        reasons: this.generateStreamReasons('commerce', logicalScore, interestScore, overallPercentage, interestArea),
        subjects: ['Business Studies', 'Economics', 'Accountancy', 'Mathematics/Computer Science'],
        careerPaths: ['Business Management', 'Finance', 'Economics', 'Entrepreneurship', 'Banking', 'Chartered Accountancy'],
        icon: '💼'
      },
      {
        id: 'arts',
        name: 'Arts/Humanities Stream',
        description: 'Focus on Literature, History, Political Science, and Psychology',
        suitability: this.calculateStreamSuitability('arts', logicalScore, interestScore, overallPercentage, interestArea),
        reasons: this.generateStreamReasons('arts', logicalScore, interestScore, overallPercentage, interestArea),
        subjects: ['Literature', 'History', 'Political Science', 'Psychology/Sociology'],
        careerPaths: ['Journalism', 'Law', 'Psychology', 'Social Work', 'Public Administration', 'Teaching'],
        icon: '🎨'
      }
    ];

    // Generate college recommendations
    const collegeRecommendations: CollegeRecommendation[] = await this.generateCollegeRecommendations(
      streamRecommendations, 
      overallPercentage, 
      interestArea
    );

    // Generate overall insights
    const overallInsights = this.generateOverallInsights(marksData, aptitudeData, conversationData);

    return {
      streamRecommendations,
      collegeRecommendations,
      overallInsights
    };
  }

  // Calculate stream suitability score
  private static calculateStreamSuitability(
    stream: string, 
    logical: number, 
    interest: number, 
    overall: number, 
    interestArea: string
  ): number {
    let baseScore = 50;
    
    // Adjust based on logical reasoning score
    baseScore += (logical - 50) * 0.3;
    
    // Adjust based on interest profiling
    baseScore += (interest - 50) * 0.2;
    
    // Adjust based on overall academic performance
    baseScore += (overall - 50) * 0.2;
    
    // Adjust based on interest area alignment
    const interestAlignment = this.getInterestAlignment(stream, interestArea);
    baseScore += interestAlignment * 0.3;
    
    return Math.max(0, Math.min(100, baseScore));
  }

  // Get interest area alignment score
  private static getInterestAlignment(stream: string, interestArea: string): number {
    const alignments: { [key: string]: { [key: string]: number } } = {
      science: {
        'Technology & Computer Science': 30,
        'Medicine & Healthcare': 25,
        'Engineering': 30,
        'Science & Research': 25
      },
      commerce: {
        'Business & Management': 30,
        'Law & Legal Studies': 20,
        'Education & Teaching': 15
      },
      arts: {
        'Arts & Humanities': 30,
        'Design & Creative Arts': 25,
        'Education & Teaching': 20,
        'Law & Legal Studies': 15
      }
    };
    
    return alignments[stream]?.[interestArea] || 0;
  }

  // Generate reasons for stream recommendation
  private static generateStreamReasons(
    stream: string, 
    logical: number, 
    interest: number, 
    overall: number, 
    interestArea: string
  ): string[] {
    const reasons: string[] = [];
    
    if (logical >= 70) {
      reasons.push('Strong performance in logical reasoning');
    }
    if (interest >= 70) {
      reasons.push('High aptitude for analytical thinking');
    }
    if (overall >= 80) {
      reasons.push('Excellent academic foundation');
    } else if (overall >= 60) {
      reasons.push('Good academic foundation');
    }
    
    const alignment = this.getInterestAlignment(stream, interestArea);
    if (alignment >= 20) {
      reasons.push('Interest alignment with chosen field');
    }
    
    // Add stream-specific reasons
    if (stream === 'science') {
      reasons.push('Strong foundation in core science subjects');
    } else if (stream === 'commerce') {
      reasons.push('Good analytical skills for business');
    } else if (stream === 'arts') {
      reasons.push('Creative thinking abilities');
    }
    
    return reasons.length > 0 ? reasons : ['Consider your interests and strengths'];
  }

  // Generate college recommendations
  private static async generateCollegeRecommendations(
    streamRecommendations: StreamRecommendation[],
    overallPercentage: number,
    interestArea: string
  ): Promise<CollegeRecommendation[]> {
    try {
      // Get colleges from database
      const { data: colleges, error } = await supabase
        .from('colleges')
        .select(`
          *,
          courses (
            name,
            cutoff_percentage,
            degree_type
          )
        `)
        .order('rating', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Filter and rank colleges based on student profile
      const recommendations: CollegeRecommendation[] = [];
      
      colleges?.forEach(college => {
        const courses = college.courses || [];
        const relevantCourse = courses.find(course => 
          this.isCourseRelevant(course, streamRecommendations, interestArea)
        );
        
        if (relevantCourse && overallPercentage >= (relevantCourse.cutoff_percentage || 0)) {
          recommendations.push({
            id: college.id,
            name: college.name,
            location: college.location,
            rating: college.rating || 0,
            cutoff: `${relevantCourse.cutoff_percentage}%+`,
            course: relevantCourse.name,
            description: this.generateCollegeDescription(college),
            whyItFits: this.generateWhyItFits(college, relevantCourse, overallPercentage, interestArea),
            officialLink: college.website_url || '#',
            image: '/api/placeholder/300/200',
            tags: this.generateCollegeTags(college, relevantCourse)
          });
        }
      });

      return recommendations.slice(0, 6); // Return top 6 recommendations
    } catch (error) {
      console.error('Error generating college recommendations:', error);
      return [];
    }
  }

  // Check if course is relevant to student profile
  private static isCourseRelevant(
    course: any, 
    streamRecommendations: StreamRecommendation[], 
    interestArea: string
  ): boolean {
    const courseName = course.name.toLowerCase();
    const interestAreaLower = interestArea.toLowerCase();
    
    // Check if course matches any stream recommendations
    const matchesStream = streamRecommendations.some(stream => 
      stream.careerPaths.some(career => 
        courseName.includes(career.toLowerCase()) || 
        career.toLowerCase().includes(courseName)
      )
    );
    
    // Check if course matches interest area
    const matchesInterest = interestAreaLower.includes('technology') && courseName.includes('computer') ||
                          interestAreaLower.includes('medicine') && courseName.includes('medical') ||
                          interestAreaLower.includes('business') && courseName.includes('business') ||
                          interestAreaLower.includes('engineering') && courseName.includes('engineering');
    
    return matchesStream || matchesInterest;
  }

  // Generate college description
  private static generateCollegeDescription(college: any): string {
    const type = college.type || 'institution';
    const category = college.category || 'educational';
    return `${type} ${category} with ${college.rating ? `${college.rating}/5` : 'good'} rating and excellent facilities`;
  }

  // Generate why it fits explanation
  private static generateWhyItFits(
    college: any, 
    course: any, 
    overallPercentage: number, 
    interestArea: string
  ): string {
    const reasons = [];
    
    if (overallPercentage >= 90) {
      reasons.push('Your excellent academic performance makes you a strong candidate');
    } else if (overallPercentage >= 80) {
      reasons.push('Your good academic performance aligns well with the requirements');
    }
    
    if (college.rating && college.rating >= 4.5) {
      reasons.push('The high rating and reputation of this institution');
    }
    
    if (interestArea.toLowerCase().includes('technology') && course.name.toLowerCase().includes('computer')) {
      reasons.push('Your interest in technology matches perfectly with this program');
    }
    
    return reasons.length > 0 
      ? reasons.join(', ') + ' for this program'
      : 'This program aligns with your academic profile and interests';
  }

  // Generate college tags
  private static generateCollegeTags(college: any, course: any): string[] {
    const tags = [];
    
    if (college.type === 'government') tags.push('Government');
    if (college.rating && college.rating >= 4.5) tags.push('Highly Rated');
    if (course.degree_type === 'bachelor') tags.push('Bachelor\'s');
    if (college.category) tags.push(college.category);
    
    return tags;
  }

  // Generate overall insights
  private static generateOverallInsights(
    marksData: any, 
    aptitudeData: any[], 
    conversationData: any
  ): {
    strengths: string[];
    areasForImprovement: string[];
    personalityTraits: string[];
    learningStyle: string;
  } {
    const logicalScore = aptitudeData.find(a => a.testType === 'logical')?.percentage || 0;
    const interestScore = aptitudeData.find(a => a.testType === 'interest')?.percentage || 0;
    const overallPercentage = marksData.overallPercentage || 0;
    
    const strengths: string[] = [];
    const areasForImprovement: string[] = [];
    const personalityTraits: string[] = [];
    
    // Analyze strengths
    if (logicalScore >= 80) {
      strengths.push('Strong analytical and logical reasoning abilities');
    }
    if (interestScore >= 80) {
      strengths.push('Clear understanding of your interests and motivations');
    }
    if (overallPercentage >= 85) {
      strengths.push('Excellent academic performance across subjects');
    } else if (overallPercentage >= 70) {
      strengths.push('Good academic foundation');
    }
    
    // Analyze areas for improvement
    if (logicalScore < 60) {
      areasForImprovement.push('Focus on developing logical reasoning skills');
    }
    if (interestScore < 60) {
      areasForImprovement.push('Explore different career paths to clarify interests');
    }
    if (overallPercentage < 70) {
      areasForImprovement.push('Work on improving academic performance in core subjects');
    }
    
    // Analyze personality traits
    if (logicalScore >= 70) {
      personalityTraits.push('Analytical thinker');
    }
    if (interestScore >= 70) {
      personalityTraits.push('Goal-oriented');
    }
    personalityTraits.push('Curious learner');
    personalityTraits.push('Systematic approach to problem-solving');
    
    // Determine learning style
    let learningStyle = 'Visual and analytical learner who benefits from structured learning environments';
    if (conversationData?.emotionalProfile?.clarity >= 0.7) {
      learningStyle = 'Clear and focused learner who thrives in organized environments';
    } else if (conversationData?.emotionalProfile?.motivation >= 0.7) {
      learningStyle = 'Highly motivated learner who benefits from challenging coursework';
    }
    
    return {
      strengths: strengths.length > 0 ? strengths : ['Good academic foundation'],
      areasForImprovement: areasForImprovement.length > 0 ? areasForImprovement : ['Continue exploring your interests'],
      personalityTraits,
      learningStyle
    };
  }

  // Save recommendations to database
  static async saveRecommendations(studentId: string, recommendations: RecommendationData) {
    try {
      const recommendationsToInsert: TablesInsert<'student_recommendations'>[] = [];
      
      // Save stream recommendations
      recommendations.streamRecommendations.forEach(stream => {
        recommendationsToInsert.push({
          student_id: studentId,
          recommendation_type: 'stream',
          recommended_id: stream.id,
          confidence_score: stream.suitability,
          reasons: stream.reasons as any,
          ai_analysis: {
            suitability: stream.suitability,
            subjects: stream.subjects,
            careerPaths: stream.careerPaths
          } as any
        });
      });
      
      // Save college recommendations
      recommendations.collegeRecommendations.forEach(college => {
        recommendationsToInsert.push({
          student_id: studentId,
          recommendation_type: 'college',
          recommended_id: college.id,
          confidence_score: 85, // Default confidence for college recommendations
          reasons: [college.whyItFits] as any,
          ai_analysis: {
            rating: college.rating,
            cutoff: college.cutoff,
            course: college.course,
            tags: college.tags
          } as any
        });
      });
      
      const { error } = await supabase
        .from('student_recommendations')
        .insert(recommendationsToInsert);
      
      if (error) throw error;
      
      return { success: true };
    } catch (error) {
      console.error('Error saving recommendations:', error);
      return { success: false, error };
    }
  }

  // Get student's recommendations
  static async getStudentRecommendations(studentId: string) {
    try {
      const { data, error } = await supabase
        .from('student_recommendations')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return { success: false, error };
    }
  }
}