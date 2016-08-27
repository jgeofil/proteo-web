export function addSequenceVirtualToSchema (schema){
  schema
    .virtual('sequence')
    .get(function () {
      if(Array.isArray(this.data.sequential)){
        var se = '';
        this.data.sequential.forEach(function(a){
          se = se + a.amino;
        })
        return se;
      }
      return null;
    });
}
