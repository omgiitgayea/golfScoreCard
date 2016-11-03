/**
 * Created by GodaiYuusaku on 11/3/16.
 */
function ScoringService()
{
    this.calculateOutScore = function (scores) {
        var out = 0;
        for(var i = 0; i < 9; i++)
        {
            out += scores[i]
        }
        return out;
    }
}

module.exports = ScoringService;