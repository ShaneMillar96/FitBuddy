using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitBuddy.Dal.Models.application;

[Table("exercise_videos")]
public partial class ExerciseVideo
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("member_id")]
    public int MemberId { get; set; }

    [Column("file_path")]
    public string FilePath { get; set; } = null!;

    [Column("exercise_type")]
    [StringLength(50)]
    public string ExerciseType { get; set; } = null!;

    [Column("analysis_result")]
    public string? AnalysisResult { get; set; }

    [Column("created_date", TypeName = "timestamp without time zone")]
    public DateTime? CreatedDate { get; set; }

    [ForeignKey("MemberId")]
    [InverseProperty("ExerciseVideos")]
    public virtual Member Member { get; set; } = null!;
}
