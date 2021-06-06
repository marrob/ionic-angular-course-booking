export class Place {
  constructor(
    public id: string,
     public title: string, 
     public description: string, 
     public imageUrl:string, 
     public price: number,
     public availableForm: Date,
     public availableTo:Date,
     public userId:string,) { }
}